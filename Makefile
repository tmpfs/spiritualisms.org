release:
	@ht --release

stage:
	@ht publish stage

production:
	@ht publish production

.PHONY: release stage production
