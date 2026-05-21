async function testFetch() {
  try {
    const storiesRes = await fetch('https://bnske.budgetndiostory.org/api/v1/content/stories/');
    const storiesData = await storiesRes.json();
    console.log('STORIES:', JSON.stringify(storiesData, null, 2));
  } catch (err) {
    console.error('Stories fetch error:', err.message);
  }

  try {
    const articlesRes = await fetch('https://bnske.budgetndiostory.org/api/v1/content/articles/');
    const articlesData = await articlesRes.json();
    console.log('ARTICLES:', JSON.stringify(articlesData, null, 2));
  } catch (err) {
    console.error('Articles fetch error:', err.message);
  }
}

testFetch();
