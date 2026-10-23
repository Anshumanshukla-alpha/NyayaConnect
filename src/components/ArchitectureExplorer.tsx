import React, { useState } from 'react';
import { VIVA_QUESTIONS, JavaCodeSnippet } from '../data/javaSourceCode';
import { LIVE_JAVA_PROJECT_FILES } from '../data/liveJavaSource';
import { 
  Code2, 
  Database, 
  Layers, 
  FileCode, 
  Check, 
  Copy, 
  Download, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  Server, 
  FolderTree,
  Terminal,
  Cpu
} from 'lucide-react';

export const ArchitectureExplorer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'CODE' | 'ARCHITECTURE' | 'VIVA' | 'STRUCTURE'>('CODE');
  const [copied, setCopied] = useState(false);

  const activeSnippet = LIVE_JAVA_PROJECT_FILES.find(f => f.id === selectedFileId) || LIVE_JAVA_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([activeSnippet.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = activeSnippet.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Advanced Java · Spring 6 · Tomcat 10.1 · MySQL 8.0
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Academic + Industry Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Java Backend Architecture &amp; Code Inspector
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Inspect the production Advanced Java codebase powering NyayaConnect: Jakarta Servlets, Spring IoC, JdbcTemplate, DAOs, Filters, and normalized MySQL schemas.
            </p>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('CODE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'CODE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Source Inspector
            </button>
            <button
              onClick={() => setActiveTab('ARCHITECTURE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'ARCHITECTURE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MVC Request Flow
            </button>
            <button
              onClick={() => setActiveTab('STRUCTURE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'STRUCTURE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Folder Structure
            </button>
            <button
              onClick={() => setActiveTab('VIVA')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'VIVA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Viva Defense Q&amp;A
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Source Code Inspector */}
      {activeTab === 'CODE' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* File Selector Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <FolderTree className="w-4 h-4 text-slate-700" />
              <span>Project Artifacts</span>
            </div>

            <div className="space-y-1.5">
              {LIVE_JAVA_PROJECT_FILES.map((f) => {
                const isSelected = selectedFileId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFileId(f.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono truncate">{f.fileName}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold font-mono ${
                        isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {f.category}
                      </span>
                    </div>
                    <span className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {f.filePath}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-3 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            
            {/* Top Toolbar */}
            <div className="px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-mono text-xs font-bold text-amber-400 flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  <span>{activeSnippet.filePath}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {activeSnippet.description}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-6 overflow-x-auto font-mono text-xs leading-relaxed max-h-[600px] overflow-y-auto">
              <pre className="text-slate-300">
                <code>{activeSnippet.code}</code>
              </pre>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: MVC Request Flow Diagram */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              End-to-End MVC Request Lifecycle &amp; Component Responsibilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Evaluator Requirement: Strict separation of concerns across Presentation, Controller, Service, DAO, and Relational Database.
            </p>
          </div>

          {/* Sequential Step Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900">Presentation Layer</h3>
              <p className="text-slate-600">JSP + JSTL 3.0</p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Renders user forms, tables, and dashboards. <strong>Zero business logic</strong> in JSP.
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900">Controller Layer</h3>
              <p className="text-slate-600">Jakarta Servlets 6.0</p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Intercepts HTTP requests, validates input, handles session, and calls Spring Services.
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900">Business Service</h3>
              <p className="text-slate-600">Spring Framework 6</p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                All business rules: slot availability, lawyer matching formula, <code>@Transactional</code> rollbacks.
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-slate-900">Data Access (DAO)</h3>
              <p className="text-slate-600">Spring JdbcTemplate</p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Executes parameterized SQL queries (<code>?, ?</code>) and maps rows via <code>RowMapper</code>.
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <h3 className="font-bold text-slate-900">Relational Database</h3>
              <p className="text-slate-600">MySQL 8.0 Engine</p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                16 normalized tables, foreign keys, indexes, and ACID transaction isolation.
              </div>
            </div>

          </div>

          {/* Concrete Flow Example Card */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 font-mono text-xs">
            <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              Concrete Flow Example: Book Appointment &amp; Confirm Consultation
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div>1. Client clicks "Submit Booking" on <code>book-appointment.jsp</code></div>
              <div>2. POST to <code>BookAppointmentServlet</code> (validates session &amp; request parameters)</div>
              <div>3. <code>AppointmentServiceImpl.createAppointment()</code> checks lawyer verification &amp; slot collision</div>
              <div>4. <code>AppointmentDAOImpl.save()</code> executes <code>INSERT INTO appointments (?, ?, ...)</code> via <code>JdbcTemplate</code></div>
              <div>5. On Acceptance: <code>VideoMeetingService</code> generates Jitsi link; transaction commits atomically</div>
              <div>6. <code>AppointmentServlet</code> forwards to <code>client-appointments.jsp</code> with confirmation token</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Complete Project Folder Structure */}
      {activeTab === 'STRUCTURE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Standard Enterprise Maven Package Hierarchy
          </h2>
          <p className="text-xs text-slate-500">
            Adheres strictly to Maven Standard Directory Layout (<code>src/main/java</code>, <code>src/main/resources</code>, <code>src/main/webapp</code>).
          </p>

          <div className="p-5 bg-slate-950 text-slate-300 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>{`nyayaconnect-legal-platform/
├── pom.xml                                   # Maven Build Descriptor (Spring 6, Tomcat 10.1, MySQL 8.0)
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── nyayaconnect/
        │           ├── config/               # AppConfig.java, DatabaseConfig.java, SecurityConfig.java
        │           ├── controller/           # LoginServlet.java, BookAppointmentServlet.java, LegalTriageServlet.java, CaseServlet.java
        │           ├── filter/               # AuthenticationFilter.java, AuthorizationFilter.java, LoggingFilter.java
        │           ├── service/              # AppointmentService.java, LawyerMatchingService.java, CaseService.java
        │           │   └── impl/             # AppointmentServiceImpl.java, CaseServiceImpl.java, DocumentServiceImpl.java
        │           ├── dao/                  # AppointmentDAO.java, UserDAO.java, LawyerDAO.java, CaseDAO.java
        │           │   └── impl/             # AppointmentDAOImpl.java, UserDAOImpl.java, CaseDAOImpl.java
        │           ├── model/                # User.java, LawyerProfile.java, Appointment.java, CaseWorkspace.java
        │           ├── dto/                  # AppointmentRequestDTO.java, TriageResultDTO.java
        │           ├── exception/            # UserNotFoundException.java, UnauthorizedAccessException.java
        │           └── util/                 # PasswordUtil.java, DateFormatter.java, JitsiTokenUtil.java
        ├── resources/
        │   ├── application.properties        # JDBC URL, connection pool sizes, storage paths
        │   └── schema.sql                    # MySQL 8.0 DDL scripts & seed records
        └── webapp/
            ├── WEB-INF/
            │   ├── web.xml                   # Deployment Descriptor (or programmatic Servlet 6.0 annotations)
            │   └── views/                    # JSP Presentation Files
            │       ├── client/               # dashboard.jsp, book-appointment.jsp, appointments.jsp
            │       ├── lawyer/               # dashboard.jsp, consultations.jsp, case-notes.jsp
            │       ├── admin/                # dashboard.jsp, verify-lawyers.jsp, user-management.jsp
            │       └── common/               # header.jsp, footer.jsp, navbar.jsp, error-403.jsp
            ├── css/                          # Application styles
            └── js/                           # Client-side UI enhancements`}</pre>
          </div>
        </div>
      )}

      {/* Tab 4: Viva Defense Master Q&A Guide */}
      {activeTab === 'VIVA' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900">
              Academic Viva &amp; Project Evaluation Master Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Detailed technical answers to common questions asked by senior external evaluators examining Advanced Java projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VIVA_QUESTIONS.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {item.question}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
