all: version help run

run:
	deno run --allow-net --allow-read --allow-write --allow-run --unstable mod.ts

help:
	deno run --allow-net --allow-read --allow-write --allow-run --unstable mod.ts --help

version:
	deno run --allow-net --allow-read --allow-write --allow-run --unstable mod.ts --version
