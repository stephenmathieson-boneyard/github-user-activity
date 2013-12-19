
build: components index.js github-user-activity.css
	@component build --dev

components: component.json
	@component install --dev

example: build
	open example/index.html

clean:
	rm -fr build components

.PHONY: clean
