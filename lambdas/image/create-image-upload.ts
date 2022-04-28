import { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';
import { ImageUpload } from '../graphql/dto';
import { MutationParams, MutationHandler } from '../graphql/helpers';
import { db, Database } from '../database';
import { sql, Transaction } from 'kysely';
import aws from 'aws-sdk';
import mime from 'mime-types';
import { assertDefinedReturn } from '../utils/assertions';
import { v4 as uuidv4 } from 'uuid';

const mimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const [minSize, maxSize] = [1024, 33554432]; // 1 KiB - 32 MiB
const uploadExpiration = 600; // 10 minutes

const s3Client = new aws.S3();

interface CreateImageUploadInput {
  filename: string;
}

export const handler: AppSyncResolverHandler<MutationParams<CreateImageUploadInput>, ImageUpload> = async (event) => {
  const identity = event.identity as AppSyncIdentityCognito;
  const input = event.arguments.input;

  return await db.transaction().execute((trx) => mutationHandler({ input, identity, trx }));
};

const mutationHandler: MutationHandler<CreateImageUploadInput, ImageUpload> = async ({
  input: { filename },
  identity,
  trx,
}) => {
  const imageId = uuidv4();
  console.log(`Creating an image upload with id ${imageId} for user ${identity.username}`);

  const params = await createImagePresignedPostParams(trx, imageId, filename);
  const post = await createPresignedPost(params);

  const expiraitonDate = new Date();
  expiraitonDate.setSeconds(expiraitonDate.getSeconds() + uploadExpiration);

  return {
    url: post.url,
    imageId,
    formData: Object.keys(post.fields).map((k) => ({ key: k, value: post.fields[k] })),
    expirationAt: expiraitonDate.toISOString(),
  };
};

async function createImagePresignedPostParams(
  trx: Transaction<Database>,
  imageId: string,
  filename: string
): Promise<aws.S3.PresignedPost.Params> {
  const mimeType = mime.lookup(filename);
  if (mimeType && mimeTypes.includes(mimeType)) {
    const key = `image/${imageId}.${mime.extension(mimeType)}`;

    const imageValues = {
      id: sql`uuid(${imageId})`.castTo<string>(),
      filename,
      mimeType,
      processed: false,
    };

    await trx.insertInto('image').values(imageValues).executeTakeFirstOrThrow();

    return {
      Expires: uploadExpiration,
      Bucket: assertDefinedReturn(process.env.UPLOAD_BUCKET_NAME),
      Conditions: [['content-length-range', minSize, maxSize]],
      Fields: {
        'Content-Type': mimeType,
        key,
      },
    };
  } else {
    throw new Error('Unsupported MIME type');
  }
}

async function createPresignedPost(params: aws.S3.PresignedPost.Params): Promise<aws.S3.PresignedPost> {
  return new Promise((resolve, reject) => {
    s3Client.createPresignedPost(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}
