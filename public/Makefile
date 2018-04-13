includes := --exclude "*" --include "index.html" --include "static/*" --exclude "*.DS_Store"
prod-cf := xxxx
dev-cf := E36NR5F3NEP538
prod-bucket := xxxx
dev-bucket := employer.workandpassion.bid
cloudfront-url := d31el8yckdmubc.cloudfront.net

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