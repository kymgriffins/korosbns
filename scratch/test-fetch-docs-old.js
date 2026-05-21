async function testDocsOld() {
  const base = "https://api.budgetndiostory.org";
  const paths = [
    "/docrepository/",
    "/api/docrepository/",
    "/repository/",
    "/api/repository/",
  ];

  for (const path of paths) {
    try {
      const url = `${base}${path}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      console.log(`Path: ${path} | Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`Length: ${text.length}`);
        try {
          const parsed = JSON.parse(text);
          console.log(`Keys:`, Object.keys(parsed));
          if (parsed.folders || parsed.documents) {
            console.log(`Success! Found folders/documents:`, {
              foldersCount: parsed.folders?.length,
              documentsCount: parsed.documents?.length
            });
            break;
          }
        } catch {
          console.log(`Response is not JSON`);
        }
      }
    } catch (err) {
      console.error(`Error on ${path}:`, err.message);
    }
  }
}

testDocsOld();
