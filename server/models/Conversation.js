/**
 * Conversation Model - نموذج المحادثة
 * MongoDB conversation model for storing chat history and quantum interactions
 * نموذج المحادثة في MongoDB لتخزين تاريخ الدردشة والتفاعلات الكمية
 */

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Message Content - محتوى الرسالة
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  
  content: {
    type: String,
    required: [true, 'محتوى الرسالة مطلوب'],
    maxlength: [10000, 'محتوى الرسالة يجب أن يكون 10000 حرف كحد أقصى']
  },
  
  // AI Response Metadata - بيانات وصفية لاستجابة الذكاء الاصطناعي
  aiMetadata: {
    model: String,
    personality: {
      type: String,
      enum: ['quantum_assistant', 'creative_quantum', 'analytical_quantum', 'educational_quantum']
    },
    temperature: {
      type: Number,
      min: 0,
      max: 1
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    usage: {
      promptTokens: Number,
      completionTokens: Number,
      totalTokens: Number
    },
    finishReason: String,
    cached: {
      type: Boolean,
      default: false
    }
  },
  
  // Quantum Metrics - المقاييس الكمية
  quantumMetrics: {
    quantumComplexity: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    conceptualDepth: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    uncertaintyLevel: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    entanglementScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    }
  },
  
  // Message Metadata - بيانات وصفية للرسالة
  timestamp: {
    type: Date,
    default: Date.now
  },
  
  processingTime: {
    type: Number, // in milliseconds
    min: 0
  },
  
  error: {
    type: String
  },
  
  fallback: {
    type: Boolean,
    default: false
  },
  
  // User Interaction - تفاعل المستخدم
  userFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: Boolean,
    comment: {
      type: String,
      maxlength: [500, 'التعليق يجب أن يكون 500 حرف كحد أقصى']
    },
    timestamp: Date
  }
});

const conversationSchema = new mongoose.Schema({
  // Basic Information - المعلومات الأساسية
  title: {
    type: String,
    required: [true, 'عنوان المحادثة مطلوب'],
    trim: true,
    maxlength: [200, 'عنوان المحادثة يجب أن يكون 200 حرف كحد أقصى']
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف المستخدم مطلوب']
  },
  
  // Conversation Settings - إعدادات المحادثة
  settings: {
    personality: {
      type: String,
      enum: ['quantum_assistant', 'creative_quantum', 'analytical_quantum', 'educational_quantum'],
      default: 'quantum_assistant'
    },
    
    temperature: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.7
    },
    
    maxTokens: {
      type: Number,
      min: 100,
      max: 4000,
      default: 2000
    },
    
    language: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar'
    },
    
    quantumEnhancement: {
      type: Boolean,
      default: true
    }
  },
  
  // Messages - الرسائل
  messages: [messageSchema],
  
  // Conversation Metadata - بيانات وصفية للمحادثة
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'العلامة يجب أن تكون 50 حرف كحد أقصى']
  }],
  
  category: {
    type: String,
    enum: ['general', 'quantum_physics', 'quantum_computing', 'education', 'research', 'creative'],
    default: 'general'
  },
  
  // Statistics - الإحصائيات
  stats: {
    totalMessages: {
      type: Number,
      default: 0
    },
    
    totalTokens: {
      type: Number,
      default: 0
    },
    
    averageResponseTime: {
      type: Number,
      default: 0
    },
    
    averageConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    
    quantumComplexityAvg: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    
    userSatisfaction: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      totalRatings: {
        type: Number,
        default: 0
      },
      helpfulCount: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Timestamps - الطوابع الزمنية
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance - فهارس لتحسين الأداء
conversationSchema.index({ user: 1, createdAt: -1 });
conversationSchema.index({ user: 1, status: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ 'settings.personality': 1 });
conversationSchema.index({ category: 1 });
conversationSchema.index({ tags: 1 });

// Virtual for message count - خاصية افتراضية لعدد الرسائل
conversationSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual for duration - خاصية افتراضية للمدة
conversationSchema.virtual('duration').get(function() {
  if (this.messages.length < 2) return 0;
  
  const firstMessage = this.messages[0];
  const lastMessage = this.messages[this.messages.length - 1];
  
  return lastMessage.timestamp - firstMessage.timestamp;
});

// Virtual for quantum score - خاصية افتراضية للنتيجة الكمية
conversationSchema.virtual('quantumScore').get(function() {
  if (this.messages.length === 0) return 0;
  
  const assistantMessages = this.messages.filter(msg => msg.role === 'assistant');
  if (assistantMessages.length === 0) return 0;
  
  const totalScore = assistantMessages.reduce((sum, msg) => {
    const metrics = msg.quantumMetrics;
    return sum + (metrics.quantumComplexity + metrics.conceptualDepth + metrics.entanglementScore) / 3;
  }, 0);
  
  return totalScore / assistantMessages.length;
});

// Pre-save middleware to update statistics - وسطية ما قبل الحفظ لتحديث الإحصائيات
conversationSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.updateStats();
    this.lastMessageAt = new Date();
  }
  
  this.updatedAt = new Date();
  next();
});

// Instance method to add message - طريقة مثيل لإضافة رسالة
conversationSchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData);
  this.updateStats();
  this.lastMessageAt = new Date();
  return this.save();
};

// Instance method to update statistics - طريقة مثيل لتحديث الإحصائيات
conversationSchema.methods.updateStats = function() {
  const {messages} = this;
  const assistantMessages = messages.filter(msg => msg.role === 'assistant');
  
  // Update basic stats
  this.stats.totalMessages = messages.length;
  
  if (assistantMessages.length > 0) {
    // Calculate total tokens
    this.stats.totalTokens = assistantMessages.reduce((sum, msg) => {
      return sum + (msg.aiMetadata?.usage?.totalTokens || 0);
    }, 0);
    
    // Calculate average response time
    const responseTimes = assistantMessages
      .filter(msg => msg.processingTime)
      .map(msg => msg.processingTime);
    
    if (responseTimes.length > 0) {
      this.stats.averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    }
    
    // Calculate average confidence
    const confidenceScores = assistantMessages
      .filter(msg => msg.aiMetadata?.confidence)
      .map(msg => msg.aiMetadata.confidence);
    
    if (confidenceScores.length > 0) {
      this.stats.averageConfidence = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;
    }
    
    // Calculate quantum complexity average
    const quantumScores = assistantMessages
      .filter(msg => msg.quantumMetrics?.quantumComplexity)
      .map(msg => msg.quantumMetrics.quantumComplexity);
    
    if (quantumScores.length > 0) {
      this.stats.quantumComplexityAvg = quantumScores.reduce((sum, score) => sum + score, 0) / quantumScores.length;
    }
  }
  
  // Update user satisfaction stats
  const ratedMessages = messages.filter(msg => msg.userFeedback?.rating);
  if (ratedMessages.length > 0) {
    const totalRating = ratedMessages.reduce((sum, msg) => sum + msg.userFeedback.rating, 0);
    this.stats.userSatisfaction.averageRating = totalRating / ratedMessages.length;
    this.stats.userSatisfaction.totalRatings = ratedMessages.length;
  }
  
  const helpfulMessages = messages.filter(msg => msg.userFeedback?.helpful === true);
  this.stats.userSatisfaction.helpfulCount = helpfulMessages.length;
};

// Instance method to add user feedback - طريقة مثيل لإضافة تقييم المستخدم
conversationSchema.methods.addUserFeedback = function(messageIndex, feedback) {
  if (messageIndex < 0 || messageIndex >= this.messages.length) {
    throw new Error('فهرس الرسالة غير صحيح');
  }
  
  this.messages[messageIndex].userFeedback = {
    ...feedback,
    timestamp: new Date()
  };
  
  this.updateStats();
  return this.save();
};

// Instance method to archive conversation - طريقة مثيل لأرشفة المحادثة
conversationSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Instance method to delete conversation - طريقة مثيل لحذف المحادثة
conversationSchema.methods.softDelete = function() {
  this.status = 'deleted';
  return this.save();
};

// Instance method to get summary - طريقة مثيل للحصول على ملخص
conversationSchema.methods.getSummary = function() {
  const userMessages = this.messages.filter(msg => msg.role === 'user');
  const assistantMessages = this.messages.filter(msg => msg.role === 'assistant');
  
  return {
    id: this._id,
    title: this.title,
    messageCount: this.messages.length,
    userMessageCount: userMessages.length,
    assistantMessageCount: assistantMessages.length,
    duration: this.duration,
    quantumScore: this.quantumScore,
    averageConfidence: this.stats.averageConfidence,
    totalTokens: this.stats.totalTokens,
    category: this.category,
    tags: this.tags,
    createdAt: this.createdAt,
    lastMessageAt: this.lastMessageAt,
    status: this.status
  };
};

// Static method to find user conversations - طريقة ثابتة للعثور على محادثات المستخدم
conversationSchema.statics.findUserConversations = function(userId, options = {}) {
  const query = { user: userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.tags && options.tags.length > 0) {
    query.tags = { $in: options.tags };
  }
  
  return this.find(query)
    .sort({ lastMessageAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

// Static method to get conversation statistics - طريقة ثابتة للحصول على إحصائيات المحادثة
conversationSchema.statics.getConversationStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status: 'active' } },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        totalMessages: { $sum: '$stats.totalMessages' },
        totalTokens: { $sum: '$stats.totalTokens' },
        averageMessagesPerConversation: { $avg: '$stats.totalMessages' },
        averageConfidence: { $avg: '$stats.averageConfidence' },
        averageQuantumComplexity: { $avg: '$stats.quantumComplexityAvg' },
        averageUserRating: { $avg: '$stats.userSatisfaction.averageRating' }
      }
    }
  ]);
  
  const categoryStats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status: 'active' } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalMessages: { $sum: '$stats.totalMessages' },
        averageConfidence: { $avg: '$stats.averageConfidence' }
      }
    }
  ]);
  
  const personalityStats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status: 'active' } },
    {
      $group: {
        _id: '$settings.personality',
        count: { $sum: 1 },
        totalMessages: { $sum: '$stats.totalMessages' },
        averageConfidence: { $avg: '$stats.averageConfidence' }
      }
    }
  ]);
  
  return {
    overall: stats[0] || {
      totalConversations: 0,
      totalMessages: 0,
      totalTokens: 0,
      averageMessagesPerConversation: 0,
      averageConfidence: 0,
      averageQuantumComplexity: 0,
      averageUserRating: 0
    },
    byCategory: categoryStats,
    byPersonality: personalityStats
  };
};

// Static method to search conversations - طريقة ثابتة للبحث في المحادثات
conversationSchema.statics.searchConversations = function(userId, searchTerm, options = {}) {
  const query = {
    user: userId,
    status: options.status || 'active',
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { 'messages.content': { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } }
    ]
  };
  
  return this.find(query)
    .sort({ lastMessageAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;