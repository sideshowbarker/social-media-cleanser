VERSION := $(shell jq -r .version extension/manifest.json)
XPI_DIR := extension/web-ext-artifacts
XPI_FILE := $(shell ls -t $(XPI_DIR)/*.xpi 2>/dev/null | head -1)

.PHONY: sign-firefox publish-firefox zip release publish-chrome publish-all clean

sign-firefox:
	cd extension && web-ext sign --channel=unlisted
	@echo "Signed: $$(ls -t $(XPI_DIR)/*.xpi | head -1)"

publish-firefox:
	cd extension && web-ext sign --channel=listed
	@echo "Submitted to AMO for review"

zip:
	cd extension && zip -r ../social-media-cleanser.zip * -x '*~' '*.swp' '.DS_Store' 'web-ext-artifacts/*' '.amo-upload-uuid'

release: sign-firefox zip
	$(eval XPI_FILE := $(shell ls -t $(XPI_DIR)/*.xpi | head -1))
	gh release create v$(VERSION) \
		"$(XPI_FILE)#Social Media Cleanser v$(VERSION) (Firefox)" \
		"social-media-cleanser.zip#Social Media Cleanser v$(VERSION) (Chrome/Edge)" \
		--title "v$(VERSION)" \
		--notes "Release v$(VERSION)"

publish-chrome: zip
	chrome-webstore-upload upload --source social-media-cleanser.zip --auto-publish

publish-all: release publish-firefox publish-chrome

clean:
	rm -rf $(XPI_DIR) social-media-cleanser.zip
