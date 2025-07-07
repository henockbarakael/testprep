// Fallback Prisma implementation for containerized environments
export const createFallbackPrisma = () => {
  const mockData = {
    users: [] as any[],
    sessions: [] as any[],
    subjects: [
      { id: '1', name: 'ELA' },
      { id: '2', name: 'Math' }
    ],
    grades: [
      { id: '1', level: 'GRADE_1' },
      { id: '2', level: 'GRADE_2' },
      { id: '3', level: 'GRADE_3' },
      { id: '4', level: 'GRADE_4' },
      { id: '5', level: 'GRADE_5' },
      { id: '6', level: 'GRADE_6' },
      { id: '7', level: 'GRADE_7' },
      { id: '8', level: 'GRADE_8' }
    ],
    questions: [] as any[],
    assessments: [] as any[]
  }

  return {
    user: {
      findUnique: async (params: any) => {
        const user = mockData.users.find(u => 
          (params.where.id && u.id === params.where.id) ||
          (params.where.email && u.email === params.where.email) ||
          (params.where.accessCode && u.accessCode === params.where.accessCode)
        )
        return user || null
      },
      findMany: async () => mockData.users,
      create: async (params: any) => {
        const newUser = {
          id: `user_${Date.now()}`,
          ...params.data,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        mockData.users.push(newUser)
        return newUser
      },
      update: async (params: any) => {
        const userIndex = mockData.users.findIndex(u => u.id === params.where.id)
        if (userIndex >= 0) {
          mockData.users[userIndex] = { ...mockData.users[userIndex], ...params.data, updatedAt: new Date() }
          return mockData.users[userIndex]
        }
        return null
      },
      delete: async (params: any) => {
        const userIndex = mockData.users.findIndex(u => u.id === params.where.id)
        if (userIndex >= 0) {
          return mockData.users.splice(userIndex, 1)[0]
        }
        return null
      }
    },
    session: {
      findUnique: async (params: any) => {
        const session = mockData.sessions.find(s => s.id === params.where.id)
        if (session && params.include?.user) {
          const user = mockData.users.find(u => u.id === session.userId)
          return { ...session, user }
        }
        return session || null
      },
      create: async (params: any) => {
        const newSession = {
          id: `session_${Date.now()}`,
          ...params.data,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        mockData.sessions.push(newSession)
        return newSession
      },
      update: async (params: any) => {
        const sessionIndex = mockData.sessions.findIndex(s => s.id === params.where.id)
        if (sessionIndex >= 0) {
          mockData.sessions[sessionIndex] = { ...mockData.sessions[sessionIndex], ...params.data, updatedAt: new Date() }
          return mockData.sessions[sessionIndex]
        }
        return null
      },
      delete: async (params: any) => {
        const sessionIndex = mockData.sessions.findIndex(s => s.id === params.where.id)
        if (sessionIndex >= 0) {
          return mockData.sessions.splice(sessionIndex, 1)[0]
        }
        return null
      }
    },
    subject: {
      findMany: async () => mockData.subjects,
      upsert: async (params: any) => {
        const existing = mockData.subjects.find(s => s.name === params.where.name)
        if (existing) {
          Object.assign(existing, params.update)
          return existing
        } else {
          const newSubject = { id: `subject_${Date.now()}`, ...params.create }
          mockData.subjects.push(newSubject)
          return newSubject
        }
      }
    },
    grade: {
      findMany: async () => mockData.grades,
      upsert: async (params: any) => {
        const existing = mockData.grades.find(g => g.level === params.where.level)
        if (existing) {
          Object.assign(existing, params.update)
          return existing
        } else {
          const newGrade = { id: `grade_${Date.now()}`, ...params.create }
          mockData.grades.push(newGrade)
          return newGrade
        }
      }
    },
    question: {
      findMany: async (params: any) => {
        let questions = [...mockData.questions]
        if (params?.where) {
          if (params.where.subject?.name) {
            questions = questions.filter(q => q.subject?.name === params.where.subject.name)
          }
          if (params.where.grade?.level) {
            questions = questions.filter(q => q.grade?.level === params.where.grade.level)
          }
        }
        return questions
      },
      findUnique: async (params: any) => {
        return mockData.questions.find(q => q.id === params.where.id) || null
      },
      create: async (params: any) => {
        const newQuestion = {
          id: `question_${Date.now()}`,
          ...params.data,
          options: [],
          correctAnswers: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        mockData.questions.push(newQuestion)
        return newQuestion
      }
    },
    questionOption: {
      create: async (params: any) => {
        const question = mockData.questions.find(q => q.id === params.data.questionId)
        if (question) {
          const option = { id: `option_${Date.now()}`, ...params.data }
          question.options = question.options || []
          question.options.push(option)
          return option
        }
        return null
      }
    },
    questionCorrectAnswer: {
      create: async (params: any) => {
        const question = mockData.questions.find(q => q.id === params.data.questionId)
        if (question) {
          const answer = { id: `answer_${Date.now()}`, ...params.data }
          question.correctAnswers = question.correctAnswers || []
          question.correctAnswers.push(answer)
          return answer
        }
        return null
      },
      deleteMany: async (params: any) => {
        const question = mockData.questions.find(q => q.id === params.where.questionId)
        if (question) {
          question.correctAnswers = []
        }
        return { count: 0 }
      }
    },
    assessment: {
      create: async (params: any) => {
        const newAssessment = {
          id: `assessment_${Date.now()}`,
          ...params.data,
          answers: [],
          takenAt: new Date()
        }
        mockData.assessments.push(newAssessment)
        return newAssessment
      }
    },
    assessmentAnswer: {
      create: async (params: any) => {
        return {
          id: `answer_${Date.now()}`,
          ...params.data,
          submittedAt: new Date()
        }
      }
    },
    $disconnect: async () => {
      console.log('Mock Prisma client disconnected')
    }
  }
}