.DEFAULT_GOAL := quick_deploy_dev
.PHONY: deploy_dev deploy_prod confirm_beta super_confirm super_duper_confirm

deploy_dev: confirm_beta real_deploy_dev

deploy_prod: confirm_prd super_confirm super_duper_confirm real_deploy_prd

confirm_beta:
	@echo -n "Are you sure you want to deploy to beta? [y/N] " && read ans && [ $${ans:-N} = y ]

confirm_prd:
	@echo -n "Are you sure you want to deploy to PRODUCTION? [y/N] " && read ans && [ $${ans:-N} = y ]

super_confirm:
	@echo -n "Are you REALLY sure you want to deploy to PRODUCTION? [y/N] " && read ans && [ $${ans:-N} = y ]

super_duper_confirm:
	@echo -n "Are you REALLY SUPER VERY sure? This will DEPLOY the current local copy of the code to PRODUCTION, and can take the main app OFFLINE. Be EXTRA sure you meant to do this. [y/N] " && read ans && [ $${ans:-N} = y ]

real_deploy_dev:
	git checkout .
	rm -rf ./vendor
	composer install --prefer-dist --optimize-autoloader --no-dev --ignore-platform-reqs
	rm -rf ./node_modules
	npm install
	npm run production
	aws s3 sync ./public s3://fantasy-calendar-dev/
	date | cat > ./setup/lambda/dev/version.txt
	chmod -R 775 ./
	serverless deploy --stage=dev
	if command -v notify-send &> /dev/null; then \
  		notify-send -t 8000 "Beta deployment done";\
  	fi;


real_deploy_prd:
	composer install --prefer-dist --optimize-autoloader --no-dev
	npm run production
	aws s3 sync ./public s3://fantasy-calendar-prod/
	date | cat > ./setup/lambda/dev/version.txt
	chmod -R 775 ./
	serverless deploy --stage=prod
	if command -v notify-send &> /dev/null; then \
  		notify-send -t 8000 "Production deployment done";\
  	fi;


quick_deploy_dev:
	rm -rf ./vendor
	composer install --prefer-dist --optimize-autoloader --no-dev --ignore-platform-reqs
	rm -rf ./node_modules
	npm install
	npm run production
	chmod -R 775 ./
	aws s3 sync ./public s3://fantasy-calendar-dev/
	serverless deploy --stage=dev --function=web
	serverless deploy --stage=dev --function=worker
	serverless deploy --stage=dev --function=console
	if command -v notify-send &> /dev/null; then \
  		notify-send -t 8000 "Beta quick deploy done";\
  	fi;

quick_deploy_prod:
	composer install --prefer-dist --optimize-autoloader --no-dev
	npm run production
	chmod -R 775 ./
	aws s3 sync ./public s3://fantasy-calendar-prod/
	serverless deploy --stage=prod --function=web
	serverless deploy --stage=prod --function=worker
	serverless deploy --stage=prod --function=console
	if command -v notify-send &> /dev/null; then \
  		notify-send -t 8000 "Production quick deploy done";\
  	fi;

local:
	docker run -it -u $(id -u):$(id -g) -v ${PWD}/:/app -w /app node npm install
	docker-compose up fantasydb fantasy-calendar php fcredis fantasy-calendar-composer-install

local-hot:
	docker-compose up fantasydb fantasy-calendar php fcredis fantasy-calendar-composer-install fantasy-calendar-npm-install
