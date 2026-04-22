/**
 * AI Service - خدمة الذكاء الاصطناعي
 * Enhanced AI service with caching, rate limiting, and quantum integration
 * خدمة ذكاء اصطناعي محسنة مع التخزين المؤقت وتحديد المعدل والتكامل الكمي
 */

import crypto from 'crypto';
import { EventEmitter } from 'events';

import OpenAI from 'openai';

class AIService extends EventEmitter {
  constructor(config) {
    super();
    
    this.config = {
      openaiApiKey: config.openaiApiKey,
      redis: config.redis,
      rateLimitConfig: config.rateLimitConfig || {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // requests per window
      },
      cacheConfig: {
        ttl: 3600, // 1 hour
        maxSize: 1000
      },
      quantumConfig: {
        enabled: true,
        confidenceThreshold: 0.7
      }
    };
    
    // Initialize OpenAI client
    if (this.config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.config.openaiApiKey
      });
    }
    
    this.redis = config.redis;
    this.conversationHistory = new Map();
    this.rateLimitStore = new Map();
    this.usageStats = {
      totalRequests: 0,
      totalTokens: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0
    };
    
    // AI Personalities with quantum-enhanced prompts
    this.personalities = {
      quantum_assistant: {
        name: 'مساعد كمي',
        nameEn: 'Quantum Assistant',
        systemPrompt: `أنت مساعد ذكي متخصص في الحوسبة الكمية والفيزياء الكمية. تستخدم منهجية ماكس بلانك في التحليل والتفسير. 
        
خصائصك:
        - خبير في الفيزياء الكمية والحوسبة الكمية
        - تطبق مبادئ التراكب والتشابك الكمي في التفكير
        - تقدم تفسيرات علمية دقيقة ومبسطة
        - تربط المفاهيم الكمية بالتطبيقات العملية
        - تستخدم الرياضيات الكمية عند الضرورة
        
أسلوبك:
        - علمي ودقيق
        - واضح ومفهوم
        - يجمع بين العمق النظري والتطبيق العملي
        - يحترم مبادئ عدم اليقين الكمي`,
        temperature: 0.7
      },
      
      creative_quantum: {
        name: 'مبدع كمي',
        nameEn: 'Creative Quantum',
        systemPrompt: `أنت مساعد إبداعي يستخدم مبادئ الحوسبة الكمية في التفكير الإبداعي. تطبق مفهوم التراكب الكمي لاستكشاف حلول متعددة ومبتكرة.
        
قدراتك:
        - التفكير في حالات متراكبة من الأفكار
        - استكشاف احتماليات متعددة للحلول
        - ربط المفاهيم المختلفة بطرق غير تقليدية
        - تطبيق مبدأ التشابك الكمي في ربط الأفكار
        - استخدام عدم اليقين الكمي كمصدر للإبداع
        
أسلوبك:
        - مبتكر ومتجدد
        - يجمع بين العلم والفن
        - يستكشف الاحتماليات اللانهائية
        - يحتضن الغموض والتعقيد`,
        temperature: 0.9
      },
      
      analytical_quantum: {
        name: 'محلل كمي',
        nameEn: 'Analytical Quantum',
        systemPrompt: `أنت محلل متخصص يستخدم الأساليب الكمية في التحليل والتقييم. تطبق مبادئ القياس الكمي والاحتمالات في تحليل البيانات والمعلومات.
        
مهاراتك:
        - تحليل البيانات باستخدام الإحصاء الكمي
        - تطبيق مبادئ عدم اليقين في التقييم
        - استخدام التراكب في تحليل السيناريوهات المتعددة
        - تقييم الاحتماليات والمخاطر
        - تطبيق نظرية المعلومات الكمية
        
أسلوبك:
        - منطقي ومنهجي
        - يعتمد على البيانات والأدلة
        - يقدر عدم اليقين والاحتماليات
        - دقيق في التحليل والاستنتاج`,
        temperature: 0.3
      },
      
      educational_quantum: {
        name: 'معلم كمي',
        nameEn: 'Educational Quantum',
        systemPrompt: `أنت معلم متخصص في تبسيط المفاهيم المعقدة باستخدام التشبيهات الكمية. تستخدم مبادئ التعليم التفاعلي والتعلم التكيفي.
        
طرق التدريس:
        - استخدام التشبيهات الكمية لتبسيط المفاهيم
        - تطبيق مبدأ التراكب في عرض وجهات نظر متعددة
        - استخدام التفاعل الكمي في التعلم النشط
        - تكييف الشرح حسب مستوى المتعلم
        - ربط النظرية بالتطبيق العملي
        
أسلوبك:
        - صبور ومتفهم
        - يشجع على الاستكشاف والتجريب
        - يحترم مستويات التعلم المختلفة
        - يستخدم أمثلة واقعية ومألوفة`,
        temperature: 0.6
      }
    };
    
    console.log('✅ AI Service initialized with quantum capabilities');
    console.log('✅ تم تهيئة خدمة الذكاء الاصطناعي مع القدرات الكمية');
  }

  /**
   * Send message to AI with quantum-enhanced processing
   * إرسال رسالة للذكاء الاصطناعي مع المعالجة المحسنة كمياً
   */
  async sendMessage(message, options = {}) {
    try {
      const startTime = Date.now();
      
      // Validate input
      if (!message || typeof message !== 'string') {
        throw new Error('Message must be a non-empty string');
      }
      
      // Check rate limiting
      await this.checkRateLimit(options.userId || 'anonymous');
      
      // Generate cache key
      const cacheKey = this.generateCacheKey(message, options);
      
      // Check cache first
      const cachedResponse = await this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        this.usageStats.cacheHits++;
        this.emit('cacheHit', { message, cacheKey });
        return cachedResponse;
      }
      
      this.usageStats.cacheMisses++;
      
      // Prepare conversation context
      const conversationId = options.conversationId || 'default';
      const personality = options.personality || 'quantum_assistant';
      const history = this.getConversationHistory(conversationId);
      
      // Apply quantum enhancement to message
      const quantumEnhancedMessage = await this.applyQuantumEnhancement(message, options);
      
      // Prepare messages for OpenAI
      const messages = this.prepareMessages(quantumEnhancedMessage, personality, history);
      
      // Send to OpenAI
      const response = await this.callOpenAI(messages, personality, options);
      
      // Process and enhance response
      const processedResponse = await this.processResponse(response, options);
      
      // Update conversation history
      this.updateConversationHistory(conversationId, message, processedResponse.content);
      
      // Cache the response
      await this.cacheResponse(cacheKey, processedResponse);
      
      // Update usage statistics
      this.updateUsageStats(response, Date.now() - startTime);
      
      // Emit events
      this.emit('messageProcessed', {
        message,
        response: processedResponse,
        processingTime: Date.now() - startTime,
        personality,
        conversationId
      });
      
      return processedResponse;
      
    } catch (error) {
      this.usageStats.errors++;
      this.emit('error', { error, message, options });
      
      console.error('AI Service Error:', error);
      
      // Return fallback response
      return this.generateFallbackResponse(message, error);
    }
  }

  /**
   * Apply quantum enhancement to message
   * تطبيق التحسين الكمي على الرسالة
   */
  async applyQuantumEnhancement(message, options) {
    if (!this.config.quantumConfig.enabled) {
      return message;
    }
    
    try {
      // Analyze message for quantum concepts
      const quantumConcepts = this.detectQuantumConcepts(message);
      
      // Apply quantum context if relevant
      if (quantumConcepts.length > 0) {
        const quantumContext = this.generateQuantumContext(quantumConcepts);
        return `${quantumContext}\n\nالسؤال الأصلي: ${message}`;
      }
      
      // Apply quantum thinking patterns
      const quantumThinking = this.applyQuantumThinking(message);
      
      return quantumThinking;
      
    } catch (error) {
      console.warn('Quantum enhancement failed, using original message:', error);
      return message;
    }
  }

  /**
   * Detect quantum concepts in message
   * اكتشاف المفاهيم الكمية في الرسالة
   */
  detectQuantumConcepts(message) {
    const quantumKeywords = {
      'تراكب': 'superposition',
      'تشابك': 'entanglement',
      'كمي': 'quantum',
      'كيوبت': 'qubit',
      'قياس': 'measurement',
      'احتمال': 'probability',
      'موجة': 'wave',
      'جسيم': 'particle',
      'هايزنبرغ': 'heisenberg',
      'شرودنغر': 'schrodinger',
      'بلانك': 'planck',
      'فوتون': 'photon',
      'إلكترون': 'electron'
    };
    
    const concepts = [];
    const lowerMessage = message.toLowerCase();
    
    for (const [arabic, english] of Object.entries(quantumKeywords)) {
      if (lowerMessage.includes(arabic) || lowerMessage.includes(english)) {
        concepts.push({ arabic, english });
      }
    }
    
    return concepts;
  }

  /**
   * Generate quantum context
   * توليد السياق الكمي
   */
  generateQuantumContext(concepts) {
    const contextParts = [
      'تم اكتشاف مفاهيم كمية في سؤالك. سأطبق منهجية ماكس بلانك في التحليل:',
      ''
    ];
    
    concepts.forEach(concept => {
      contextParts.push(`• ${concept.arabic} (${concept.english})`);
    });
    
    contextParts.push('');
    contextParts.push('سأستخدم مبادئ الحوسبة الكمية في تحليل وحل هذا السؤال.');
    
    return contextParts.join('\n');
  }

  /**
   * Apply quantum thinking patterns
   * تطبيق أنماط التفكير الكمي
   */
  applyQuantumThinking(message) {
    // Add quantum thinking context
    const quantumPrefix = `تطبيق مبادئ التفكير الكمي:\n• التراكب: استكشاف حلول متعددة متزامنة\n• عدم اليقين: تقدير الاحتماليات والشكوك\n• التشابك: ربط المفاهيم المترابطة\n\n`;
    
    return quantumPrefix + message;
  }

  /**
   * Check rate limiting
   * فحص تحديد المعدل
   */
  async checkRateLimit(userId) {
    const now = Date.now();
    const windowStart = now - this.config.rateLimitConfig.windowMs;
    
    // Get user's request history
    let userRequests = this.rateLimitStore.get(userId) || [];
    
    // Remove old requests outside the window
    userRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (userRequests.length >= this.config.rateLimitConfig.max) {
      throw new Error(`Rate limit exceeded. Maximum ${this.config.rateLimitConfig.max} requests per ${this.config.rateLimitConfig.windowMs / 1000} seconds.`);
    }
    
    // Add current request
    userRequests.push(now);
    this.rateLimitStore.set(userId, userRequests);
    
    // Store in Redis if available
    if (this.redis) {
      try {
        const key = `rate_limit:${userId}`;
        await this.redis.setex(key, Math.ceil(this.config.rateLimitConfig.windowMs / 1000), JSON.stringify(userRequests));
      } catch (error) {
        console.warn('Failed to store rate limit in Redis:', error);
      }
    }
  }

  /**
   * Generate cache key
   * توليد مفتاح التخزين المؤقت
   */
  generateCacheKey(message, options) {
    const keyData = {
      message: message.trim().toLowerCase(),
      personality: options.personality || 'quantum_assistant',
      temperature: options.temperature,
      maxTokens: options.maxTokens
    };
    
    return crypto.createHash('sha256').update(JSON.stringify(keyData)).digest('hex');
  }

  /**
   * Get cached response
   * الحصول على الاستجابة المخزنة مؤقتاً
   */
  async getCachedResponse(cacheKey) {
    if (!this.redis) {
      return null;
    }
    
    try {
      const cached = await this.redis.get(`ai_cache:${cacheKey}`);
      if (cached) {
        const response = JSON.parse(cached);
        response.cached = true;
        response.cacheTimestamp = new Date().toISOString();
        return response;
      }
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
    }
    
    return null;
  }

  /**
   * Cache response
   * تخزين الاستجابة مؤقتاً
   */
  async cacheResponse(cacheKey, response) {
    if (!this.redis) {
      return;
    }
    
    try {
      const cacheData = { ...response };
      delete cacheData.cached;
      delete cacheData.cacheTimestamp;
      
      await this.redis.setex(
        `ai_cache:${cacheKey}`,
        this.config.cacheConfig.ttl,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  }

  /**
   * Prepare messages for OpenAI
   * تحضير الرسائل لـ OpenAI
   */
  prepareMessages(message, personality, history) {
    const personalityConfig = this.personalities[personality] || this.personalities.quantum_assistant;
    
    const messages = [
      {
        role: 'system',
        content: personalityConfig.systemPrompt
      }
    ];
    
    // Add conversation history
    history.forEach(entry => {
      messages.push(
        { role: 'user', content: entry.user },
        { role: 'assistant', content: entry.assistant }
      );
    });
    
    // Add current message
    messages.push({ role: 'user', content: message });
    
    return messages;
  }

  /**
   * Call OpenAI API
   * استدعاء واجهة برمجة تطبيقات OpenAI
   */
  async callOpenAI(messages, personality, options) {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Please provide API key.');
    }
    
    const personalityConfig = this.personalities[personality] || this.personalities.quantum_assistant;
    
    const requestConfig = {
      model: options.model || 'gpt-4',
      messages,
      temperature: options.temperature ?? personalityConfig.temperature,
      max_tokens: options.maxTokens || 2000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    };
    
    const response = await this.openai.chat.completions.create(requestConfig);
    
    return response;
  }

  /**
   * Process AI response
   * معالجة استجابة الذكاء الاصطناعي
   */
  async processResponse(openaiResponse, options) {
    const choice = openaiResponse.choices[0];
    const {content} = choice.message;
    
    // Calculate quantum metrics
    const quantumMetrics = this.calculateQuantumMetrics(content, options);
    
    // Calculate confidence score
    const confidence = this.calculateConfidence(choice, quantumMetrics);
    
    return {
      content,
      confidence,
      quantumMetrics,
      usage: openaiResponse.usage,
      model: openaiResponse.model,
      timestamp: new Date().toISOString(),
      finishReason: choice.finish_reason,
      cached: false
    };
  }

  /**
   * Calculate quantum metrics
   * حساب المقاييس الكمية
   */
  calculateQuantumMetrics(content, options) {
    const metrics = {
      quantumComplexity: 0,
      conceptualDepth: 0,
      uncertaintyLevel: 0,
      entanglementScore: 0
    };
    
    // Analyze quantum complexity
    const quantumTerms = ['كمي', 'تراكب', 'تشابك', 'احتمال', 'قياس', 'موجة'];
    const quantumCount = quantumTerms.reduce((count, term) => {
      return count + (content.toLowerCase().split(term).length - 1);
    }, 0);
    
    metrics.quantumComplexity = Math.min(1, quantumCount / 10);
    
    // Analyze conceptual depth
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    metrics.conceptualDepth = Math.min(1, avgSentenceLength / 100);
    
    // Analyze uncertainty level
    const uncertaintyWords = ['ربما', 'قد', 'يمكن', 'محتمل', 'غير مؤكد', 'تقريباً'];
    const uncertaintyCount = uncertaintyWords.reduce((count, word) => {
      return count + (content.toLowerCase().split(word).length - 1);
    }, 0);
    
    metrics.uncertaintyLevel = Math.min(1, uncertaintyCount / 5);
    
    // Analyze entanglement score (interconnectedness of concepts)
    const connectiveWords = ['لذلك', 'وبالتالي', 'كما', 'أيضاً', 'بالإضافة', 'علاوة'];
    const connectiveCount = connectiveWords.reduce((count, word) => {
      return count + (content.toLowerCase().split(word).length - 1);
    }, 0);
    
    metrics.entanglementScore = Math.min(1, connectiveCount / 8);
    
    return metrics;
  }

  /**
   * Calculate confidence score
   * حساب درجة الثقة
   */
  calculateConfidence(choice, quantumMetrics) {
    let confidence = 0.5; // Base confidence
    
    // Adjust based on finish reason
    if (choice.finish_reason === 'stop') {
      confidence += 0.3;
    } else if (choice.finish_reason === 'length') {
      confidence += 0.1;
    }
    
    // Adjust based on quantum metrics
    confidence += quantumMetrics.quantumComplexity * 0.1;
    confidence += quantumMetrics.conceptualDepth * 0.1;
    
    // Uncertainty can be good in quantum contexts
    if (quantumMetrics.uncertaintyLevel > 0.3 && quantumMetrics.uncertaintyLevel < 0.7) {
      confidence += 0.1;
    }
    
    return Math.min(1, Math.max(0, confidence));
  }

  /**
   * Quantum-enhanced text analysis
   * تحليل نص محسّن كمياً
   */
  async quantumAnalyzeText({ text, analysisType = 'concepts', quantumDepth = 3, userId = 'anonymous' }) {
    const start = Date.now();
    try {
      // Basic validation
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('Text must be a non-empty string');
      }

      // Rate limit per user
      await this.checkRateLimit(userId);

      const normalized = text.trim();

      // Core metrics
      const concepts = this.detectQuantumConcepts(normalized);
      const quantumMetrics = this.calculateQuantumMetrics(normalized, { quantumDepth });

      // Sentiment (very simple heuristic, bilingual)
      const positiveWords = ['جيد','رائع','ممتاز','سعيد','نجاح','thanx','thanks','great','good','excellent','happy','success'];
      const negativeWords = ['سيئ','حزين','فشل','خطأ','سئ','terrible','bad','sad','fail','error'];
      const lc = normalized.toLowerCase();
      const pos = positiveWords.reduce((n,w) => n + (lc.split(w).length - 1), 0);
      const neg = negativeWords.reduce((n,w) => n + (lc.split(w).length - 1), 0);
      const sentimentScore = Math.max(-1, Math.min(1, (pos - neg) / Math.max(1, pos + neg)));

      // Complexity (based on length, vocabulary variety, sentences)
      const sentences = normalized.split(/[.!؟?\n]+/).filter(s => s.trim().length>0);
      const words = normalized.split(/\s+/).filter(w => w.length>0);
      const vocab = new Set(words.map(w => w.toLowerCase()));
      const complexity = {
        sentenceCount: sentences.length,
        avgSentenceLength: sentences.length ? Math.round(words.length / sentences.length) : words.length,
        vocabularySize: vocab.size,
        lexicalDiversity: words.length ? Number((vocab.size / words.length).toFixed(3)) : 0
      };

      // Entanglement insights: surface relationships via connective words seen in metrics
      const entanglementInsights = {
        score: quantumMetrics.entanglementScore,
        note: quantumMetrics.entanglementScore > 0.6 ? 'High interconnection of ideas' :
              quantumMetrics.entanglementScore > 0.3 ? 'Moderate conceptual linkage' : 'Low linkage'
      };

      // Optional "quantum_state" style summary
      const suggestedQubits = Math.min(10, Math.max(1, Math.ceil(Math.log2(Math.max(2, vocab.size)))));
      const stateSummary = {
        suggestedQubits,
        depth: Math.min(5, Math.max(1, quantumDepth)),
        superpositionHints: concepts.length > 1,
        entanglementHints: entanglementInsights.score > 0.5
      };

      // Select payload based on analysisType
      let details;
      switch (analysisType) {
        case 'sentiment':
          details = { sentimentScore, positiveMatches: pos, negativeMatches: neg };
          break;
        case 'complexity':
          details = complexity;
          break;
        case 'quantum_state':
          details = stateSummary;
          break;
        case 'entanglement':
          details = entanglementInsights;
          break;
        case 'concepts':
        default:
          details = { concepts };
          break;
      }

      const processingTime = Date.now() - start;
      const tokensEstimate = Math.ceil(words.length * 1.2);

      // Update usage stats lightly
      this.usageStats.totalRequests++;
      this.usageStats.totalTokens += tokensEstimate;

      const result = {
        type: analysisType,
        quantumMetrics,
        details,
        concepts,
        tokensEstimated: tokensEstimate,
        processingTime
      };

      this.emit('quantumAnalysisCompleted', { userId, analysisType, processingTime, metrics: quantumMetrics });
      return result;
    } catch (error) {
      this.usageStats.errors++;
      this.emit('error', { error, text, context: 'quantumAnalyzeText' });
      return {
        type: analysisType,
        error: true,
        message: 'Quantum analysis failed',
        errorMessage: error.message,
        processingTime: Date.now() - start
      };
    }
  }

  /**
   * Generate fallback response
   * توليد استجابة احتياطية
   */
  generateFallbackResponse(message, error) {
    const fallbackResponses = [
      'أعتذر، واجهت صعوبة في معالجة طلبك. دعني أحاول مرة أخرى بطريقة مختلفة.',
      'يبدو أن هناك تداخل كمي في النظام. سأطبق مبدأ عدم اليقين وأقدم لك إجابة تقريبية.',
      'حدث خطأ في المعالجة الكمية. سأستخدم الحوسبة التقليدية للإجابة على سؤالك.',
      'أواجه تحدياً تقنياً حالياً. هل يمكنك إعادة صياغة سؤالك بطريقة مختلفة؟'
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      content: randomResponse,
      confidence: 0.3,
      quantumMetrics: {
        quantumComplexity: 0,
        conceptualDepth: 0,
        uncertaintyLevel: 1,
        entanglementScore: 0
      },
      error: error.message,
      fallback: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get conversation history
   * الحصول على تاريخ المحادثة
   */
  getConversationHistory(conversationId) {
    return this.conversationHistory.get(conversationId) || [];
  }

  /**
   * Update conversation history
   * تحديث تاريخ المحادثة
   */
  updateConversationHistory(conversationId, userMessage, assistantMessage) {
    const history = this.getConversationHistory(conversationId);
    
    history.push({
      user: userMessage,
      assistant: assistantMessage,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 exchanges
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
    
    this.conversationHistory.set(conversationId, history);
    
    // Store in Redis if available
    if (this.redis) {
      try {
        this.redis.setex(
          `conversation:${conversationId}`,
          3600, // 1 hour
          JSON.stringify(history)
        );
      } catch (error) {
        console.warn('Failed to store conversation history in Redis:', error);
      }
    }
  }

  /**
   * Clear conversation history
   * مسح تاريخ المحادثة
   */
  clearConversationHistory(conversationId) {
    this.conversationHistory.delete(conversationId);
    
    if (this.redis) {
      try {
        this.redis.del(`conversation:${conversationId}`);
      } catch (error) {
        console.warn('Failed to clear conversation history from Redis:', error);
      }
    }
    
    this.emit('conversationCleared', { conversationId });
  }

  /**
   * Update usage statistics
   * تحديث إحصائيات الاستخدام
   */
  updateUsageStats(response, processingTime) {
    this.usageStats.totalRequests++;
    
    if (response.usage) {
      this.usageStats.totalTokens += response.usage.total_tokens || 0;
    }
    
    // Store detailed stats in Redis
    if (this.redis) {
      try {
        const statsKey = `ai_stats:${new Date().toISOString().split('T')[0]}`;
        this.redis.hincrby(statsKey, 'requests', 1);
        this.redis.hincrby(statsKey, 'tokens', response.usage?.total_tokens || 0);
        this.redis.hincrby(statsKey, 'processing_time', processingTime);
        this.redis.expire(statsKey, 86400 * 30); // Keep for 30 days
      } catch (error) {
        console.warn('Failed to update usage stats in Redis:', error);
      }
    }
  }

  /**
   * Get usage statistics
   * الحصول على إحصائيات الاستخدام
   */
  getUsageStats() {
    return {
      ...this.usageStats,
      cacheHitRate: this.usageStats.totalRequests > 0 ? 
        (this.usageStats.cacheHits / this.usageStats.totalRequests) * 100 : 0,
      averageTokensPerRequest: this.usageStats.totalRequests > 0 ? 
        this.usageStats.totalTokens / this.usageStats.totalRequests : 0,
      errorRate: this.usageStats.totalRequests > 0 ? 
        (this.usageStats.errors / this.usageStats.totalRequests) * 100 : 0
    };
  }

  /**
   * Get available personalities
   * الحصول على الشخصيات المتاحة
   */
  getPersonalities() {
    return Object.entries(this.personalities).map(([key, personality]) => ({
      key,
      name: personality.name,
      nameEn: personality.nameEn,
      temperature: personality.temperature
    }));
  }

  /**
   * Health check
   * فحص الصحة
   */
  async healthCheck() {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        openai: Boolean(this.openai),
        redis: Boolean(this.redis) && this.redis.status === 'ready'
      },
      stats: this.getUsageStats(),
      memory: {
        conversations: this.conversationHistory.size,
        rateLimits: this.rateLimitStore.size
      }
    };
    
    // Test OpenAI connection if available
    if (this.openai) {
      try {
        await this.openai.models.list();
        health.services.openai = true;
      } catch (error) {
        health.services.openai = false;
        health.status = 'degraded';
      }
    }
    
    return health;
  }
}

export { AIService };