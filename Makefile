.PHONY: dev build run lint typecheck check clean install

dev:
	npm run dev

build:
	npm run build

run:
	npm run start

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

check: lint typecheck build

clean:
	rm -rf .next

install:
	npm install
