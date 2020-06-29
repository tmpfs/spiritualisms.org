clean:
	@rm -rf ./build

release:
	@rm -rf ./build/release
	@ht --release

stage:
	@ht publish stage

production:
	@ht publish production

.PHONY: clean release stage production
