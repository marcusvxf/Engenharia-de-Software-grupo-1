import axios from 'axios';

interface RagResponse {
  query: string;
  answer: string;
  sources: Array<{
    title: string;
    preview: string;
  }>;
}

export class RagService {
  private ragBaseUrl: string;

  constructor() {
    this.ragBaseUrl = process.env.RAG_SERVICE_URL || 'http://localhost:8000';
  }

  public async getAnswer(prompt: string, history: string): Promise<string> {
    try {
      console.log(`🤖 Enviando pergunta para RAG: "${prompt}"`);
      
      const response = await axios.post<RagResponse>(`${this.ragBaseUrl}/search/`, {
        text: prompt,
        max_results: 3
      }, {
        timeout: 30000, // 30 segundos de timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Resposta recebida do RAG');
      return response.data.answer;
    } catch (error: any) {
      console.error('❌ Erro ao consultar RAG:', error);
      
      // Tratamento específico de erros
      if (error?.code === 'ECONNREFUSED') {
        return 'Desculpe, o sistema de busca está temporariamente indisponível. Tente novamente em alguns minutos.';
      } else if (error?.response?.status === 400) {
        return 'Desculpe, não consegui processar sua pergunta. Pode reformulá-la?';
      }
      
      return 'Desculpe, não foi possível processar sua pergunta no momento. Tente novamente.';
    }
  }
}
