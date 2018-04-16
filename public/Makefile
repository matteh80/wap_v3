includes := --exclude "*" --include "*" --include "static/*" --include "js/*" --include "fonts/*" --exclude "*.DS_Store" --exclude "Makefile"
dev-cf := E3SYCOZWU45SLE
dev-cloudfront-url := d35azydueyszpf.cloudfront.net
dev-bucket := app.workandpassion.bid
prod-cf := E3PGJAGLZBMV7B
prod-cloudfront-url := d2mfjtxjdi75t8.cloudfront.net
prod-bucket := app.workandpassion.se

dry-dev:
	aws s3 sync ./ s3://$(dev-bucket) $(includes) --acl public-read --delete --dryrun
dry-prod:
	aws s3 sync ./ s3://$(prod-bucket) $(includes) --acl public-read --delete --dryrun
deploy-dev:
	aws s3 sync ./ s3://$(dev-bucket) $(includes) --acl public-read --delete
	aws cloudfront create-invalidation --distribution-id $(dev-cf) --paths /index.html
deploy-prod:
	aws s3 sync ./ s3://$(prod-bucket) $(includes) --acl public-read --delete
	aws cloudfront create-invalidation --distribution-id $(prod-cf) --paths /index.html

