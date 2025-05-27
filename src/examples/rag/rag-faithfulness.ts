/**
 * RAG Faithfulness Example
 * 
 * This example demonstrates how to ensure that responses from a RAG (Retrieval-Augmented
 * Generation) system remain faithful to the retrieved documents.
 */
export const ragFaithfulness = {
  title: "RAG Faithfulness",
  description: "Ensuring RAG responses accurately represent the source documents",
  category: "rag/basics",
  difficulty: "intermediate",
  prompt: `You are a RAG system. I will provide you with a query and some retrieved documents.
Your task is to answer the query using ONLY the information in the documents.
If the documents don't contain the information needed to answer the query, say "I don't have enough information to answer this query."
Do not introduce any information not present in the documents.

Query: What are the side effects of the medication Prednisone?

Retrieved Documents:
[Document 1] Prednisone is a corticosteroid medication primarily used to suppress the immune system and decrease inflammation. It's prescribed for conditions like asthma, COPD, and rheumatoid arthritis.

[Document 2] Common side effects of Prednisone include increased appetite, weight gain, mood changes (including irritability and anxiety), insomnia, fluid retention, and elevated blood sugar. Long-term use may cause more serious effects such as osteoporosis, adrenal suppression, increased susceptibility to infections, and cataracts.

[Document 3] For optimal results, take Prednisone with food to minimize stomach irritation. Follow your doctor's instructions for tapering off the medication when stopping, as sudden discontinuation can be dangerous.`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": "You are a RAG system. I will provide you with a query and some retrieved documents.\\nYour task is to answer the query using ONLY the information in the documents.\\nIf the documents don't contain the information needed to answer the query, say \\"I don't have enough information to answer this query.\\"\\nDo not introduce any information not present in the documents.\\n\\nQuery: What are the side effects of the medication Prednisone?\\n\\nRetrieved Documents:\\n[Document 1] Prednisone is a corticosteroid medication primarily used to suppress the immune system and decrease inflammation. It's prescribed for conditions like asthma, COPD, and rheumatoid arthritis.\\n\\n[Document 2] Common side effects of Prednisone include increased appetite, weight gain, mood changes (including irritability and anxiety), insomnia, fluid retention, and elevated blood sugar. Long-term use may cause more serious effects such as osteoporosis, adrenal suppression, increased susceptibility to infections, and cataracts.\\n\\n[Document 3] For optimal results, take Prednisone with food to minimize stomach irritation. Follow your doctor's instructions for tapering off the medication when stopping, as sudden discontinuation can be dangerous."
    }
  ],
  temperature=0,
  max_tokens=300
)`,
  expectedOutput: `Based on the retrieved documents, the side effects of Prednisone include:

Common side effects:
- Increased appetite
- Weight gain
- Mood changes (including irritability and anxiety)
- Insomnia
- Fluid retention
- Elevated blood sugar
- Stomach irritation (implied by the recommendation to take with food)

Long-term use may cause more serious effects:
- Osteoporosis
- Adrenal suppression
- Increased susceptibility to infections
- Cataracts

Additionally, sudden discontinuation of Prednisone can be dangerous, which is why tapering off the medication following a doctor's instructions is recommended.`,
  papers: [
    {
      title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      url: "https://arxiv.org/abs/2005.11401",
      year: "2020"
    }
  ],
  tags: ["rag", "faithfulness", "retrieval", "medical-information", "nlp"]
};

// Python-specific RAG example
export const pythonRAGExample = {
  title: "RAG Implementation in Python",
  description: "Building a simple RAG system with Python and LangChain",
  category: "rag/python",
  difficulty: "advanced",
  prompt: `Create a Python function using LangChain that implements a basic RAG system for answering questions about Python programming. The function should:

1. Take a user question and a collection of Python documentation chunks as input
2. Retrieve the most relevant documentation chunks
3. Generate an answer using the retrieved context
4. Ensure the response is faithful to the retrieved documents
5. Include code examples where appropriate`,
  expectedOutput: `import os
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

def create_python_rag_system(docs_chunks):
    """
    Create a RAG system for answering Python programming questions.
    
    Args:
        docs_chunks: List of strings containing Python documentation chunks
    
    Returns:
        A function that takes a question string and returns an answer
    """
    # Initialize embeddings
    embeddings = OpenAIEmbeddings()
    
    # Create vector store from documentation chunks
    vectorstore = FAISS.from_texts(docs_chunks, embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    # Define prompt template to ensure faithfulness
    template = """You are a Python programming expert. Use the following retrieved documentation to answer the question.
    If the documentation doesn't contain the information needed, say "I don't have enough information to answer this question."
    
    Retrieved documentation:
    {context}
    
    Question: {question}
    
    Include Python code examples in your answer where appropriate.
    """
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=template
    )
    
    # Create QA chain
    llm = ChatOpenAI(model_name="gpt-4", temperature=0)
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt}
    )
    
    def answer_python_question(question):
        """
        Answer a Python programming question using RAG.
        
        Args:
            question: String containing the user's question
            
        Returns:
            String containing the answer with code examples
        """
        result = qa_chain({"query": question})
        return result["result"]
    
    return answer_python_question`,
  papers: [],
  tags: ["python", "langchain", "rag-implementation", "code-examples", "retrieval"]
};
