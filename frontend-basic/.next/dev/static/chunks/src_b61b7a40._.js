(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/axios.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000
});
// Token management
const getToken = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem("mindchat_auth_token");
};
// Request interceptor - Add auth token
api.interceptors.request.use((config)=>{
    const token = getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor - Handle errors
// Note: We don't auto-logout on 401 because it could be a specific endpoint issue
// The AuthProvider will handle session expiry properly
api.interceptors.response.use((response)=>response, (error)=>{
    // Just reject the error - let individual components handle it
    // Don't force logout on 401 as it may be a specific endpoint issue
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/auth.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/axios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/axios/index.js [app-client] (ecmascript) <locals>");
;
;
const AUTH_ENDPOINTS = {
    PATIENT_LOGIN: "/api/auth/patient/login",
    PATIENT_REGISTER: "/api/auth/patient/register",
    PSYCHOLOGIST_LOGIN: "/api/auth/psychologist/login",
    PSYCHOLOGIST_REGISTER: "/api/auth/psychologist/register"
};
// Helper to extract AuthResponse from error
const handleAuthError = (error)=>{
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"] && error.response?.data) {
        // Backend returns AuthResponse format on 400 errors
        return error.response.data;
    }
    return {
        success: false,
        errors: [
            "Error de conexión. Por favor, intenta de nuevo."
        ]
    };
};
const authService = {
    // Login methods
    async loginPatient (data) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(AUTH_ENDPOINTS.PATIENT_LOGIN, data);
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    },
    async loginPsychologist (data) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(AUTH_ENDPOINTS.PSYCHOLOGIST_LOGIN, data);
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    },
    // Generic login - tries both endpoints
    async login (data) {
        // Try patient login first
        const patientResponse = await this.loginPatient(data);
        if (patientResponse.success) {
            return patientResponse;
        }
        // Try psychologist login if patient fails
        const psychologistResponse = await this.loginPsychologist(data);
        return psychologistResponse;
    },
    // Registration methods
    async registerPatient (data) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(AUTH_ENDPOINTS.PATIENT_REGISTER, data);
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    },
    async registerPsychologist (data) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(AUTH_ENDPOINTS.PSYCHOLOGIST_REGISTER, data);
            return response.data;
        } catch (error) {
            return handleAuthError(error);
        }
    }
};
const __TURBOPACK__default__export__ = authService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/clinical.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clinicalService",
    ()=>clinicalService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/axios.ts [app-client] (ecmascript)");
;
const CLINICAL_ENDPOINTS = {
    // Patients
    GET_PATIENT_PROFILE: (userId)=>`/api/clinical/patients/${userId}`,
    UPDATE_PATIENT_PROFILE: (profileId)=>`/api/clinical/patients/${profileId}`,
    // Psychologists
    GET_ALL_PSYCHOLOGISTS: "/api/clinical/psychologists",
    GET_PSYCHOLOGIST_PROFILE: (userId)=>`/api/clinical/psychologists/${userId}`,
    UPDATE_PSYCHOLOGIST_PROFILE: (profileId)=>`/api/clinical/psychologists/${profileId}`,
    SEARCH_PSYCHOLOGISTS: "/api/clinical/psychologists/search",
    // Tags
    GET_ALL_TAGS: "/api/clinical/psychologists/tags"
};
const clinicalService = {
    // Patient Profile
    async getPatientProfile (userId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(CLINICAL_ENDPOINTS.GET_PATIENT_PROFILE(userId));
        return response.data;
    },
    async updatePatientProfile (profileId, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(CLINICAL_ENDPOINTS.UPDATE_PATIENT_PROFILE(profileId), data);
        return response.data;
    },
    // Psychologist Profile
    async getAllPsychologists () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(CLINICAL_ENDPOINTS.GET_ALL_PSYCHOLOGISTS);
        return response.data;
    },
    async getPsychologistProfile (userId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(CLINICAL_ENDPOINTS.GET_PSYCHOLOGIST_PROFILE(userId));
        return response.data;
    },
    async updatePsychologistProfile (profileId, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(CLINICAL_ENDPOINTS.UPDATE_PSYCHOLOGIST_PROFILE(profileId), data);
        return response.data;
    },
    async searchPsychologists (query) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(CLINICAL_ENDPOINTS.SEARCH_PSYCHOLOGISTS, {
            params: {
                query
            }
        });
        return response.data;
    },
    // Tags
    async getAllTags () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(CLINICAL_ENDPOINTS.GET_ALL_TAGS);
        return response.data;
    }
};
const __TURBOPACK__default__export__ = clinicalService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/appointment.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appointmentService",
    ()=>appointmentService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/axios.ts [app-client] (ecmascript)");
;
const APPOINTMENT_ENDPOINTS = {
    GET_ALL: "/api/appointments",
    GET_BY_ID: (id)=>`/api/appointments/${id}`,
    GET_BY_PSYCHOLOGIST: (psychologistId)=>`/api/appointments/psychologist/${psychologistId}`,
    GET_BY_PATIENT: (patientId)=>`/api/appointments/patient/${patientId}`,
    CREATE: "/api/appointments",
    UPDATE: (id)=>`/api/appointments/${id}`,
    CANCEL: (id)=>`/api/appointments/${id}/cancel`,
    DELETE: (id)=>`/api/appointments/${id}`
};
const appointmentService = {
    // Get appointments
    async getAll () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(APPOINTMENT_ENDPOINTS.GET_ALL);
        return response.data;
    },
    async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(APPOINTMENT_ENDPOINTS.GET_BY_ID(id));
        return response.data;
    },
    async getByPsychologist (psychologistId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(APPOINTMENT_ENDPOINTS.GET_BY_PSYCHOLOGIST(psychologistId));
        return response.data;
    },
    async getByPatient (patientId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(APPOINTMENT_ENDPOINTS.GET_BY_PATIENT(patientId));
        return response.data;
    },
    // Create appointment
    async create (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(APPOINTMENT_ENDPOINTS.CREATE, data);
        return response.data;
    },
    // Update appointment
    async update (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(APPOINTMENT_ENDPOINTS.UPDATE(id), data);
        return response.data;
    },
    // Cancel appointment
    async cancel (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(APPOINTMENT_ENDPOINTS.CANCEL(id));
        return response.data;
    },
    // Delete appointment
    async delete (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(APPOINTMENT_ENDPOINTS.DELETE(id));
    }
};
const __TURBOPACK__default__export__ = appointmentService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/chat.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chatService",
    ()=>chatService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/axios.ts [app-client] (ecmascript)");
;
// Session Request Endpoints
const SESSION_REQUEST_ENDPOINTS = {
    GET_ALL: "/api/session-requests",
    GET_BY_ID: (id)=>`/api/session-requests/${id}`,
    GET_BY_PATIENT: (patientId)=>`/api/session-requests/patient/${patientId}`,
    GET_BY_PSYCHOLOGIST: (psychologistId)=>`/api/session-requests/psychologist/${psychologistId}`,
    GET_PENDING: "/api/session-requests/pending",
    CREATE: "/api/session-requests",
    UPDATE_STATUS: (id)=>`/api/session-requests/${id}/status`,
    ASSIGN: (id)=>`/api/session-requests/${id}/assign`
};
// Chat Endpoints
const CHAT_ENDPOINTS = {
    GET_ALL: "/api/chats",
    GET_BY_ID: (id)=>`/api/chats/${id}`,
    GET_BY_USER: (userId)=>`/api/chats/user/${userId}`,
    CREATE: "/api/chats",
    CLOSE: (id)=>`/api/chats/${id}/close`
};
// Message Endpoints
const MESSAGE_ENDPOINTS = {
    GET_BY_CHAT: (chatId)=>`/api/messages/chat/${chatId}`,
    SEND: "/api/messages"
};
const chatService = {
    // Session Requests
    async getAllSessionRequests () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(SESSION_REQUEST_ENDPOINTS.GET_ALL);
        return response.data;
    },
    async getSessionRequestById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(SESSION_REQUEST_ENDPOINTS.GET_BY_ID(id));
        return response.data;
    },
    async getSessionRequestsByPatient (patientId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(SESSION_REQUEST_ENDPOINTS.GET_BY_PATIENT(patientId));
        return response.data;
    },
    async getSessionRequestsByPsychologist (psychologistId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(SESSION_REQUEST_ENDPOINTS.GET_BY_PSYCHOLOGIST(psychologistId));
        return response.data;
    },
    async getPendingSessionRequests () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(SESSION_REQUEST_ENDPOINTS.GET_PENDING);
        return response.data;
    },
    async createSessionRequest (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(SESSION_REQUEST_ENDPOINTS.CREATE, data);
        return response.data;
    },
    async updateSessionStatus (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(SESSION_REQUEST_ENDPOINTS.UPDATE_STATUS(id), data);
        return response.data;
    },
    async assignPsychologist (sessionRequestId, psychologistId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(SESSION_REQUEST_ENDPOINTS.ASSIGN(sessionRequestId), {
            psychologistId
        });
        return response.data;
    },
    // Chats
    async getAllChats () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(CHAT_ENDPOINTS.GET_ALL);
        return response.data;
    },
    async getChatById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(CHAT_ENDPOINTS.GET_BY_ID(id));
        return response.data;
    },
    async getChatsByUser (userId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(CHAT_ENDPOINTS.GET_BY_USER(userId));
        return response.data;
    },
    async createChat (sessionRequestId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(CHAT_ENDPOINTS.CREATE, {
            sessionRequestId
        });
        return response.data;
    },
    async closeChat (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(CHAT_ENDPOINTS.CLOSE(id));
        return response.data;
    },
    // Messages
    async getMessagesByChat (chatId) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(MESSAGE_ENDPOINTS.GET_BY_CHAT(chatId));
        return response.data;
    },
    async sendMessage (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(MESSAGE_ENDPOINTS.SEND, data);
        return response.data;
    }
};
const __TURBOPACK__default__export__ = chatService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/axios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/auth.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$clinical$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/clinical.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appointment$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/appointment.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/chat.service.ts [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/AuthProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/auth.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/browser/util/decode_jwt.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Storage keys for authentication persistence
// Note: These are storage keys, not cryptographic secrets
const STORAGE_KEYS = {
    TOKEN: "mindchat_auth_token",
    USER: "mindchat_auth_user",
    COOKIE: "mindchat_auth_token"
};
// Cookie helper functions for middleware compatibility
const setCookie = (name, value, days = 7)=>{
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};
const deleteCookie = (name)=>{
    if (typeof document === "undefined") return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
/**
 * Decode JWT and extract user info for UI purposes.
 * 
 * SECURITY NOTE: This decoding without cryptographic verification is intentional
 * for client-side use only. The JWT is verified server-side on every API request.
 * Client-side decoding is safe here because:
 * 1. All API endpoints validate the JWT signature server-side
 * 2. This is only used for UI rendering (user display, role-based navigation)
 * 3. Actual authorization is enforced by the backend
 */ const decodeToken = (token)=>{
    try {
        // Client-side JWT decoding for UI purposes only
        // Server validates signature on all authenticated API calls
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeJwt"])(token);
        return {
            id: payload.sub,
            email: payload.email || "",
            fullName: payload.name || "",
            role: payload.role || "Patient",
            profileId: payload.profileId
        };
    } catch  {
        return null;
    }
};
/**
 * Check if token is expired based on the exp claim.
 * See decodeToken for security notes on client-side JWT handling.
 */ const isTokenExpired = (token)=>{
    try {
        // Client-side expiration check for UX only
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeJwt"])(token);
        const exp = payload.exp;
        return Date.now() >= exp * 1000;
    } catch  {
        return true;
    }
};
function AuthProvider({ children }) {
    _s();
    const [authState, setAuthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true
    });
    // Initialize auth state from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const initAuth = {
                "AuthProvider.useEffect.initAuth": ()=>{
                    try {
                        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
                        const userJson = localStorage.getItem(STORAGE_KEYS.USER);
                        if (token && !isTokenExpired(token)) {
                            const user = userJson ? JSON.parse(userJson) : decodeToken(token);
                            setAuthState({
                                user,
                                token,
                                isAuthenticated: true,
                                isLoading: false
                            });
                        } else {
                            // Clear expired token
                            localStorage.removeItem(STORAGE_KEYS.TOKEN);
                            localStorage.removeItem(STORAGE_KEYS.USER);
                            setAuthState({
                                user: null,
                                token: null,
                                isAuthenticated: false,
                                isLoading: false
                            });
                        }
                    } catch  {
                        setAuthState({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false
                        });
                    }
                }
            }["AuthProvider.useEffect.initAuth"];
            initAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (email, password)=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].login({
                    email,
                    password
                });
                if (response.success && response.token) {
                    const user = {
                        id: response.userId || "",
                        email: response.email || email,
                        fullName: response.fullName || "",
                        role: response.role || "Patient",
                        profileId: response.profileId
                    };
                    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
                    // Set cookie for middleware (server-side) access
                    setCookie(STORAGE_KEYS.COOKIE, response.token);
                    setAuthState({
                        user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
                return response;
            } catch (error) {
                const errorResponse = {
                    success: false,
                    errors: [
                        "Error al iniciar sesión. Por favor, intenta de nuevo."
                    ]
                };
                return errorResponse;
            }
        }
    }["AuthProvider.useCallback[login]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": ()=>{
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            deleteCookie(STORAGE_KEYS.COOKIE);
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            });
            window.location.href = "/login";
        }
    }["AuthProvider.useCallback[logout]"], []);
    const updateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateUser]": (user)=>{
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            setAuthState({
                "AuthProvider.useCallback[updateUser]": (prev)=>({
                        ...prev,
                        user
                    })
            }["AuthProvider.useCallback[updateUser]"]);
        }
    }["AuthProvider.useCallback[updateUser]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            ...authState,
            login,
            logout,
            updateUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/store/AuthProvider.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "G/kiC9vQWBjtzba9Q8rnPXEyssE=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const __TURBOPACK__default__export__ = AuthContext;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/ChatProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatProvider",
    ()=>ChatProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useChat",
    ()=>useChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnectionBuilder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@microsoft/signalr/dist/esm/HubConnection.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$ILogger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@microsoft/signalr/dist/esm/ILogger.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/AuthProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const ChatContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const SIGNALR_HUB_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SIGNALR_HUB_URL || "http://localhost:8080/chathub";
function ChatProvider({ children }) {
    _s();
    const { token, user, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [connection, setConnection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [connectionError, setConnectionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentChatId, setCurrentChatId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const connectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Build connection when authenticated (but don't start it automatically)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatProvider.useEffect": ()=>{
            if (!isAuthenticated || !token) {
                // Cleanup if not authenticated
                if (connectionRef.current) {
                    connectionRef.current.stop().catch({
                        "ChatProvider.useEffect": ()=>{}
                    }["ChatProvider.useEffect"]);
                    connectionRef.current = null;
                    setConnection(null);
                    setIsConnected(false);
                }
                return;
            }
            // Only build if we don't have a connection yet
            if (connectionRef.current) return;
            const newConnection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnectionBuilder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubConnectionBuilder"]().withUrl(SIGNALR_HUB_URL, {
                accessTokenFactory: {
                    "ChatProvider.useEffect.newConnection": ()=>token
                }["ChatProvider.useEffect.newConnection"],
                withCredentials: false
            }).withAutomaticReconnect([
                0,
                2000,
                5000,
                10000,
                30000
            ]).configureLogging(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$ILogger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LogLevel"].Warning) // Reduce noise
            .build();
            connectionRef.current = newConnection;
            setConnection(newConnection);
            // Handle incoming messages
            newConnection.on("ReceiveMessage", {
                "ChatProvider.useEffect": (data)=>{
                    const newMessage = {
                        id: data.id,
                        chatId: data.chatId,
                        senderUserId: data.senderUserId,
                        message: data.message,
                        sentAt: data.sentAt,
                        isOwnMessage: data.senderUserId === user?.id
                    };
                    setMessages({
                        "ChatProvider.useEffect": (prev)=>[
                                ...prev,
                                newMessage
                            ]
                    }["ChatProvider.useEffect"]);
                }
            }["ChatProvider.useEffect"]);
            // Handle errors
            newConnection.on("Error", {
                "ChatProvider.useEffect": (error)=>{
                    console.error("SignalR Error: ", error);
                    setConnectionError(error);
                }
            }["ChatProvider.useEffect"]);
            // Handle reconnection events
            newConnection.onreconnecting({
                "ChatProvider.useEffect": ()=>{
                    setIsConnected(false);
                    setIsConnecting(true);
                }
            }["ChatProvider.useEffect"]);
            newConnection.onreconnected({
                "ChatProvider.useEffect": ()=>{
                    setIsConnected(true);
                    setIsConnecting(false);
                    setConnectionError(null);
                    // Rejoin current chat if any
                    if (currentChatId) {
                        newConnection.invoke("JoinChat", currentChatId).catch({
                            "ChatProvider.useEffect": ()=>{}
                        }["ChatProvider.useEffect"]);
                    }
                }
            }["ChatProvider.useEffect"]);
            newConnection.onclose({
                "ChatProvider.useEffect": ()=>{
                    setIsConnected(false);
                    setIsConnecting(false);
                }
            }["ChatProvider.useEffect"]);
            // Cleanup on unmount
            return ({
                "ChatProvider.useEffect": ()=>{
                    if (connectionRef.current) {
                        connectionRef.current.stop().catch({
                            "ChatProvider.useEffect": ()=>{}
                        }["ChatProvider.useEffect"]);
                    }
                }
            })["ChatProvider.useEffect"];
        }
    }["ChatProvider.useEffect"], [
        isAuthenticated,
        token,
        user?.id,
        currentChatId
    ]);
    // Manual connect function - call this when entering chat page
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[connect]": async ()=>{
            if (!connectionRef.current) return;
            if (connectionRef.current.state === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubConnectionState"].Connected) return;
            if (isConnecting) return;
            setIsConnecting(true);
            setConnectionError(null);
            try {
                await connectionRef.current.start();
                setIsConnected(true);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Connection failed";
                setConnectionError(errorMessage);
                setIsConnected(false);
            } finally{
                setIsConnecting(false);
            }
        }
    }["ChatProvider.useCallback[connect]"], [
        isConnecting
    ]);
    // Manual disconnect function
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[disconnect]": async ()=>{
            if (!connectionRef.current) return;
            if (connectionRef.current.state !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubConnectionState"].Connected) return;
            try {
                await connectionRef.current.stop();
                setIsConnected(false);
                setCurrentChatId(null);
                setMessages([]);
            } catch (err) {
                console.error("Error disconnecting:", err);
            }
        }
    }["ChatProvider.useCallback[disconnect]"], []);
    const joinChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[joinChat]": async (chatId)=>{
            if (connection?.state === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubConnectionState"].Connected && chatId !== currentChatId) {
                try {
                    // Leave current chat first
                    if (currentChatId) {
                        await connection.invoke("LeaveChat", currentChatId);
                    }
                    await connection.invoke("JoinChat", chatId);
                    setCurrentChatId(chatId);
                    setMessages([]); // Clear messages when joining new chat
                } catch (err) {
                    console.error("Error joining chat: ", err);
                }
            }
        }
    }["ChatProvider.useCallback[joinChat]"], [
        connection,
        currentChatId
    ]);
    const leaveChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[leaveChat]": async (chatId)=>{
            if (connection?.state === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubConnectionState"].Connected) {
                try {
                    await connection.invoke("LeaveChat", chatId);
                    if (currentChatId === chatId) {
                        setCurrentChatId(null);
                        setMessages([]);
                    }
                } catch (err) {
                    console.error("Error leaving chat: ", err);
                }
            }
        }
    }["ChatProvider.useCallback[leaveChat]"], [
        connection,
        currentChatId
    ]);
    const sendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[sendMessage]": async (chatId, message)=>{
            if (connection?.state === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubConnectionState"].Connected) {
                try {
                    await connection.invoke("SendMessage", chatId, message);
                } catch (err) {
                    console.error("Error sending message: ", err);
                    throw err;
                }
            }
        }
    }["ChatProvider.useCallback[sendMessage]"], [
        connection
    ]);
    const addMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[addMessage]": (message)=>{
            setMessages({
                "ChatProvider.useCallback[addMessage]": (prev)=>[
                        ...prev,
                        message
                    ]
            }["ChatProvider.useCallback[addMessage]"]);
        }
    }["ChatProvider.useCallback[addMessage]"], []);
    const clearMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[clearMessages]": ()=>{
            setMessages([]);
        }
    }["ChatProvider.useCallback[clearMessages]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatContext.Provider, {
        value: {
            connection,
            isConnected,
            isConnecting,
            connectionError,
            currentChatId,
            messages,
            connect,
            disconnect,
            joinChat,
            leaveChat,
            sendMessage,
            addMessage,
            setMessages,
            clearMessages
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/store/ChatProvider.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
}
_s(ChatProvider, "nXn6yXGrHvqvi/BRrmJh5ISNNIk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ChatProvider;
function useChat() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}
_s1(useChat, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const __TURBOPACK__default__export__ = ChatContext;
var _c;
__turbopack_context__.k.register(_c, "ChatProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/QueryProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function QueryProvider({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "QueryProvider.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1
                    }
                }
            })
    }["QueryProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/store/QueryProvider.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_s(QueryProvider, "imk3LCT+w+ZXi0YGvd+Wxxsv7kw=");
_c = QueryProvider;
const __TURBOPACK__default__export__ = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_b61b7a40._.js.map