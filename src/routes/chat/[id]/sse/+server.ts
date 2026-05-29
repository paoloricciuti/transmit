import { controllers } from '$lib/controller';

const text_encoder = new TextEncoder();

export function GET({ params: { id } }) {
	let controller: ReadableStreamDefaultController;
	return new Response(
		new ReadableStream({
			start(_controller) {
				controller = _controller;
				if (!controllers.has(id)) {
					controllers.set(id, new Set());
				}
				controllers.get(id)?.add(controller);

				controller.enqueue(text_encoder.encode(`:connected\n\n`));
			},
			cancel() {
				controllers.get(id)?.delete(controller);
			}
		}),
		{
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		}
	);
}
