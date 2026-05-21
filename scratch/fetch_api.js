async function test() {
  try {
    const res = await fetch("https://bnske.budgetndiostory.org/api/v1/content/stories/");
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Full Body Length:", text.length);
    console.log("Body Snippet (first 1000):", text.slice(0, 1000));
    console.log("Body Snippet (last 1000):", text.slice(-1000));
    try {
      const parsed = JSON.parse(text);
      console.log("Parsed keys:", Object.keys(parsed));
      if (parsed.results) {
        console.log("Results count:", parsed.results.length);
        if (parsed.results.length > 0) {
          console.log("First result keys:", Object.keys(parsed.results[0]));
          console.log("First result JSON:", JSON.stringify(parsed.results[0], null, 2));
        }
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
test();
