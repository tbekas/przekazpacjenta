import MainStack from './MainStack';
import * as sst from '@serverless-stack/resources';
import MigrationsStack from './MigrationsStack';

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
  });

  const mainStack = new MainStack(app, 'main-stack', {
    hostedZoneName: process.env.HOSTED_ZONE_NAME || '',
    siteDomainName: prefixWithStageIfNotProd(process.env.SITE_DOMAIN_NAME || '', app.stage),
    imagesDomainName: prefixWithStageIfNotProd(process.env.IMAGES_DOMAIN_NAME || '', app.stage),
    emailDomainName: prefixWithStageIfNotProd(process.env.EMAIL_DOMAIN_NAME || '', app.stage),
    senderEmailName: process.env.SENDER_EMAIL_NAME || '',
    senderEmailLocalPart: process.env.SENDER_EMAIL_LOCAL_PART || '',
    replyToEmailLocalPart: process.env.REPLY_TO_EMAIL_LOCAL_PART || '',
    supportEmailLocalPart: process.env.SUPPORT_EMAI_LOCAL_PARTL || '',
  });

  const migrationsStack = new MigrationsStack(app, 'migrations-stack', {
    rds: mainStack.rds,
    dbName: mainStack.dbName,
  });

  migrationsStack.addDependency(mainStack);
}

function prefixWithStageIfNotProd(domain: string, stage: string): string {
  return stage === 'prod' ? domain : `${stage}.${domain}`;
}
