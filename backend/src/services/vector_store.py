from typing import List, Dict, Optional
import logging
import chromadb
from chromadb.utils import embedding_functions

class VectorStore:
    def __init__(
        self, 
        collection_name: str = "documents",
        persist_directory: str = "chroma_db",
        embedding_model_name: str = "all-MiniLM-L6-v2"
    ):
        self.collection_name = collection_name
        self.persist_directory = persist_directory
        self.embedding_model_name = embedding_model_name
        self.client = self._initialize_client()
        self.collection = self._get_or_create_collection()
    
    def _initialize_client(self):
        """Initialize connection to ChromaDB"""
        try:
            # New way to initialize the client
            return chromadb.PersistentClient(path=self.persist_directory)
        except Exception as e:
            logging.error(f"Failed to initialize Chroma client: {str(e)}")
            raise
        
    def _get_or_create_collection(self):
        """Get or create a collection with embedding function"""
        try:
            embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name=self.embedding_model_name
            )
            return self.client.get_or_create_collection(
                name=self.collection_name,
                embedding_function=embedding_func,
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            logging.error(f"Failed to get/create collection: {str(e)}")
            raise

    async def add_texts(self, texts: List[str], metadatas: List[Dict], ids: Optional[List[str]] = None) -> None:
        """Store text chunks in vector database with metadata"""
        try:
            self.collection.add(
                documents=texts,
                metadatas=metadatas,
                ids=ids if ids else [str(i) for i in range(len(texts))]
            )
            # No need to explicitly call persist() with the new client
        except Exception as e:
            logging.error(f"Vector storage failed: {str(e)}")
            raise

    def similarity_search(self, query: str, k: int = 4) -> List[Dict]:
        """Search for similar documents"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=k,
                include=["documents", "metadatas", "distances"]
            )
            return [
                {
                    "document": doc,
                    "metadata": meta,
                    "score": 1 - dist
                }
                for doc, meta, dist in zip(
                    results["documents"][0],
                    results["metadatas"][0],
                    results["distances"][0]
                )
            ]
        except Exception as e:
            logging.error(f"Similarity search failed: {str(e)}")
            raise