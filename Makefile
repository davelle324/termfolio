.PHONY: dev build start lint typecheck check clean install

dev:
	npm run dev

build:
	npm run build

start:
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
