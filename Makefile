release:
	@uwe --release

stage:
	@uwe publish stage

production:
	@uwe publish production

.PHONY: release stage production
