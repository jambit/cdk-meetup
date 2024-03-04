# CDK-Meetup

## Voraussetzungen

1. aws-cli
2. nodejs

AWS-CLI konfigurieren
* `aws configure`
1. access key angeben
2. secret key angeben
3. region angeben, bspw. eu-central-1
4. outputformat kann belassen werden oder zu json oder yaml geändert werden, ist für die Beispiele nicht weiter relevant

AWS-CDK installieren
* `npm install -g aws-cdk`

Vorbereitung einer AWS-Umgebung für CDK-Deployments. Muss für jede Umgebung in welche Ressourcen bereitgestellt werden, einmalig ausgeführt werden.
* `cdk bootstrap`

## cdk-website
Demonstriert, wie eine statische Website in einen S3-Bucket geladen und über diesen bereitgestellt wird.

* `npm run deploy`
* `npm run cdk destroy`

## cdk-function
Demonstriert, wie eine Lambda bereitgestellt werden kann, welche nach einem festgelegtem Muster regelmäßig ausgeführt wird.

* `npm run deploy`
* `npm run cdk destroy`

## cdk-security
Demonstriert, wie mittels cdk-nag ein cdk-stack auf Sicherheitsmängel geprüft werden kann.

* `npm run deploy`
* `npm run cdk destroy`

## cdk stages
Demonstriert wie cdk-stacks einheitlich für verschiedene Umgebungen bereitgestellt werden können.

* `npm run deploy:dev`
* `npm run deploy:prod`
* `npm run cdk destroy`