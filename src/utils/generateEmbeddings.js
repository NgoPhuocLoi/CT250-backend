async function generateEmbeddingsFrom(text) {
  try {
    const res = await fetch(process.env.NLP_TEXT_EMBEDDING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.NLP_CLOUD_API}`,
      },
      body: JSON.stringify({ sentences: [text] }),
    });
    const data = await res.json();

    return data.embeddings[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  generateEmbeddingsFrom,
};
