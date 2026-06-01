# transmit

This project is mostly an experiment. I wanted to see what it could take to build something seemingly impossible to do without JS using the power of HTML, CSS a sprinkle of HTTP and obviously Svelte and SvelteKit.

## How it works?

There are a combination of techniques to make this works flawlessly and I will explore them in a future blogpost but the gist of it is:

1. there's a single [Chat.svelte](src/routes/chat/[id]/Chat.svelte) component that is used both when the user load the page from the browser and when it navigates to it with the client side router.
1. If the page is loaded from the server it initially renders an iframe that points to a [route](src/routes/chat/[id]/iframe/+page.svelte) that only renders the messages.
1. The iframe has a `<meta http-equiv="Refresh" />` header that reloads the page every 5 seconds to achieve "live" messages
1. When `browser` is `true` instead of rendering the iframe we render the component that uses a `query.live` to get the updated messages.
1. The form has a target of the iframe name which means on submit it will refresh the iframe instead of navigating away.

There's also a bunch of extra stuff to make it look the same in both cases.
