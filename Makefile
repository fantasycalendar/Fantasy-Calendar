.DEFAULT_GOAL := quick_deploy_dev

deploy_dev:
	composer install --prefer-dist --optimize-autoloader --no-dev
	chmod -R 775 ./
	serverless deploy --stage=dev

deploy_prod:
	composer install --prefer-dist --optimize-autoloader --no-dev
	chmod -R 775 ./
	serverless deploy --stage=prod

quick_deploy_dev:
	composer install --prefer-dist --optimize-autoloader --no-dev
	chmod -R 775 ./
	serverless deploy --stage=dev --function=web

quick_deploy_prod:
	composer install --prefer-dist --optimize-autoloader --no-dev
	chmod -R 775 ./
	serverless deploy --stage=prod --function=web
