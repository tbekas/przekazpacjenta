import * as fs from 'fs';
import { S3Handler, S3EventRecord } from 'aws-lambda';
import aws from 'aws-sdk';
import { thumbnails, hires } from './image-config';
import { db, Database } from '../database';
import { sql, Transaction } from 'kysely';
import sharp from 'sharp';
import { assertDefinedReturn } from '../utils/assertions';

const s3Client = new aws.S3();

export const handler: S3Handler = async (event) => {
  for (const record of event.Records) {
    await db.transaction().execute((trx) => processEventRecordInTransaction(trx, record));
  }
};

async function processEventRecordInTransaction(trx: Transaction<Database>, record: S3EventRecord) {
  const key = record.s3.object.key;
  const imageId = key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));

  const image = await trx
    .selectFrom('image')
    .forUpdate()
    .where('id', '=', sql`uuid(${imageId})`.castTo<string>())
    .where('processed', '=', false)
    .selectAll()
    .executeTakeFirstOrThrow();

  console.log(`Processing image with id ${image.id}`);

  const tmpDir = fs.mkdtempSync(image.id);
  const tmpFilename = (label: string) => `${tmpDir}/${label}.webp`;

  const sharpStream = sharp({
    failOnError: false,
  });

  const processImgPromises = thumbnails
    .map(({ width, height, quality, label }) =>
      sharpStream.clone().resize({ width, height }).webp({ quality }).toFile(tmpFilename(label))
    )
    .concat([
      sharpStream
        .clone()
        .resize({ width: hires.maxHeight, height: hires.maxHeight, withoutEnlargement: true })
        .webp({ quality: hires.quality })
        .toFile(tmpFilename(hires.label)),
    ]);

  const getObjectRequest = {
    Bucket: record.s3.bucket.name,
    Key: record.s3.object.key,
  };

  s3Client.getObject(getObjectRequest).createReadStream().pipe(sharpStream);

  const labels = thumbnails.map(({ label }) => label).concat([hires.label]);

  try {
    await Promise.all(processImgPromises);

    for (const label of labels) {
      const stream = fs.createReadStream(tmpFilename(label));

      const putObjectRequest = {
        Bucket: record.s3.bucket.name,
        Key: `${label}/${imageId}.webp`,
        Body: stream,
      };

      await s3Client.putObject(putObjectRequest).promise();
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (tmpDir) {
      fs.rmSync(tmpDir, { recursive: true });
    }
  }

  const domain = assertDefinedReturn(process.env.IMAGES_DOMAIN_NAME);
  const imageValues = {
    processed: true,
    url: `https://${domain}/${hires.label}/${image.id}`,
    thumbnailsJson: JSON.stringify(
      thumbnails.map(({ label, width, height }) => ({
        label,
        width,
        height,
        url: `https://${domain}/${label}/${image.id}`,
      }))
    ),
  };

  await trx
    .updateTable('image')
    .set(imageValues)
    .where('id', '=', sql`uuid(${image.id})`.castTo<string>())
    .executeTakeFirstOrThrow();
}
