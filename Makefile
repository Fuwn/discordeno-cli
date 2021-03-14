flags = --allow-net --allow-read --allow-write --allow-run --unstable

all: version help run

run:
	deno run $(flags) mod.ts

help:
	deno run $(flags) mod.ts --help

version:
	deno run $(flags) mod.ts --version
