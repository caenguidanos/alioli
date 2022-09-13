<h1>Index</h1>

<a href="/">Go to index</a>
<a href="/blog/123">Go to Blog 123</a>
<a href="/blog/234">Go to Blog 234</a>
<a href="/contact">Go to contact</a>
<a href="/images">Go to Images</a>
<a href="http://google.com">Go to Google</a>
<a href="/ygfygfgsydfgdsufgysfug">Go to unknown</a>

<button
   id="index-view-goto-same"
   on:click={async () => {
      let action = await import("../hydration/navigate-to");
      await action.default("/");
   }}>Go to index</button
>

<button
   id="index-view-goto-blog"
   on:click={async () => {
      let action = await import("../hydration/navigate-to");
      await action.default("/blog/897");
   }}>Go to blog</button
>
