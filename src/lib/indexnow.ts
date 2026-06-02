const INDEXNOW_KEY = "0bcd5d6f742043f9b7f8f004ab5424dc";
const HOST = "budgetndiostory.org";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

/**
 * Pings Bing/IndexNow with a list of URLs that have been updated or created.
 * @param urls Array of absolute URLs (e.g. ['https://budgetndiostory.org/learn'])
 */
export async function pingIndexNow(urls: string[]) {
  if (!urls || urls.length === 0) return false;

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    if (response.ok) {
      console.log(`✅ Successfully submitted ${urls.length} URLs to IndexNow.`);
      return true;
    } else {
      console.error(`❌ IndexNow submission failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Error pinging IndexNow:", error);
    return false;
  }
}
