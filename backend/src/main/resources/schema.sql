CREATE DATABASE IF NOT EXISTS nyayaconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nyayaconnect;
CREATE TABLE IF NOT EXISTS users (id CHAR(36) PRIMARY KEY,name VARCHAR(120) NOT NULL,email VARCHAR(254) NOT NULL UNIQUE,password_hash VARCHAR(100) NOT NULL,role ENUM('CLIENT','LAWYER','ADMIN') NOT NULL,blocked BOOLEAN NOT NULL DEFAULT FALSE,phone VARCHAR(40),city VARCHAR(100),state VARCHAR(100),last_login TIMESTAMP NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS lawyer_profiles (id CHAR(36) PRIMARY KEY,user_id CHAR(36) NOT NULL UNIQUE,bar_council_number VARCHAR(100) NOT NULL UNIQUE,verification_status ENUM('PENDING','UNDER_REVIEW','VERIFIED','REJECTED','SUSPENDED','EXPIRED') NOT NULL DEFAULT 'PENDING',bio TEXT,experience_years INT NOT NULL DEFAULT 0,city VARCHAR(100),court VARCHAR(160),consultation_fee DECIMAL(12,2) NOT NULL DEFAULT 0,rating DECIMAL(3,2) NOT NULL DEFAULT 0,review_count INT NOT NULL DEFAULT 0,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT fk_lawyer_user FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS lawyer_practice_areas (lawyer_id CHAR(36) NOT NULL,practice_area VARCHAR(120) NOT NULL,PRIMARY KEY(lawyer_id,practice_area),FOREIGN KEY(lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS lawyer_languages (lawyer_id CHAR(36) NOT NULL,language_name VARCHAR(80) NOT NULL,PRIMARY KEY(lawyer_id,language_name),FOREIGN KEY(lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS lawyer_availability (id CHAR(36) PRIMARY KEY,lawyer_id CHAR(36) NOT NULL,weekday TINYINT NOT NULL,starts_at TIME NOT NULL,ends_at TIME NOT NULL,active BOOLEAN NOT NULL DEFAULT TRUE,FOREIGN KEY(lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE CASCADE,INDEX idx_avail_lawyer_day(lawyer_id,weekday));
CREATE TABLE IF NOT EXISTS cases (id CHAR(36) PRIMARY KEY,case_number VARCHAR(40) NOT NULL UNIQUE,title VARCHAR(200) NOT NULL,category VARCHAR(120),description TEXT,client_id CHAR(36) NOT NULL,lawyer_id CHAR(36) NULL,status ENUM('OPEN','ACTIVE','ON_HOLD','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,FOREIGN KEY(client_id) REFERENCES users(id),FOREIGN KEY(lawyer_id) REFERENCES users(id),INDEX idx_cases_client(client_id),INDEX idx_cases_lawyer(lawyer_id));
CREATE TABLE IF NOT EXISTS appointments (id CHAR(36) PRIMARY KEY,case_id CHAR(36) NULL,client_id CHAR(36) NOT NULL,lawyer_id CHAR(36) NOT NULL,starts_at DATETIME NOT NULL,ends_at DATETIME NOT NULL,status ENUM('REQUESTED','PENDING','CONFIRMED','COMPLETED','REJECTED','CANCELLED','REFUND_PENDING','REFUNDED','NO_SHOW','DISPUTED') NOT NULL DEFAULT 'PENDING',client_notes TEXT,lawyer_notes TEXT,meeting_provider VARCHAR(40),meeting_url VARCHAR(500),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(case_id) REFERENCES cases(id),FOREIGN KEY(client_id) REFERENCES users(id),FOREIGN KEY(lawyer_id) REFERENCES users(id),INDEX idx_appt_lawyer_time(lawyer_id,starts_at,ends_at),INDEX idx_appt_client_time(client_id,starts_at));
CREATE TABLE IF NOT EXISTS appointment_history (id CHAR(36) PRIMARY KEY,appointment_id CHAR(36) NOT NULL,from_status VARCHAR(40),to_status VARCHAR(40) NOT NULL,changed_by CHAR(36) NOT NULL,reason VARCHAR(500),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,FOREIGN KEY(changed_by) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS documents (id CHAR(36) PRIMARY KEY,case_id CHAR(36) NOT NULL,original_name VARCHAR(255) NOT NULL,storage_key VARCHAR(500) NOT NULL UNIQUE,mime_type VARCHAR(120) NOT NULL,size_bytes BIGINT NOT NULL,sha256 CHAR(64) NOT NULL,classification VARCHAR(120),classification_confidence VARCHAR(20),uploaded_by CHAR(36) NOT NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE,FOREIGN KEY(uploaded_by) REFERENCES users(id),INDEX idx_documents_case(case_id));
CREATE TABLE IF NOT EXISTS document_versions (id CHAR(36) PRIMARY KEY,document_id CHAR(36) NOT NULL,version_no INT NOT NULL,storage_key VARCHAR(500) NOT NULL,sha256 CHAR(64) NOT NULL,size_bytes BIGINT NOT NULL,mime_type VARCHAR(120) NOT NULL,uploaded_by CHAR(36) NOT NULL,change_reason VARCHAR(500),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(document_id,version_no),FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,FOREIGN KEY(uploaded_by) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS document_access_logs (id CHAR(36) PRIMARY KEY,document_id CHAR(36) NOT NULL,user_id CHAR(36) NOT NULL,action ENUM('VIEW','DOWNLOAD','UPLOAD','DELETE_ATTEMPT','DENIED') NOT NULL,ip_address VARCHAR(64),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS case_timeline (id CHAR(36) PRIMARY KEY,case_id CHAR(36) NOT NULL,event_type VARCHAR(50) NOT NULL,title VARCHAR(200) NOT NULL,description TEXT,created_by CHAR(36) NOT NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE,FOREIGN KEY(created_by) REFERENCES users(id),INDEX idx_timeline_case(case_id,created_at));
CREATE TABLE IF NOT EXISTS case_tasks (id CHAR(36) PRIMARY KEY,case_id CHAR(36) NOT NULL,title VARCHAR(200) NOT NULL,status ENUM('TODO','IN_PROGRESS','BLOCKED','COMPLETED','OVERDUE') NOT NULL DEFAULT 'TODO',due_at DATETIME NULL,assigned_to CHAR(36),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE,FOREIGN KEY(assigned_to) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS case_deadlines (id CHAR(36) PRIMARY KEY,case_id CHAR(36) NOT NULL,title VARCHAR(200) NOT NULL,due_at DATETIME NOT NULL,source_note VARCHAR(500),status ENUM('OPEN','COMPLETED','MISSED') NOT NULL DEFAULT 'OPEN',FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE,INDEX idx_deadlines_due(status,due_at));
CREATE TABLE IF NOT EXISTS consultations (id CHAR(36) PRIMARY KEY,appointment_id CHAR(36) NOT NULL UNIQUE,started_at DATETIME NULL,ended_at DATETIME NULL,notes TEXT,FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS reviews (id CHAR(36) PRIMARY KEY,appointment_id CHAR(36) NOT NULL UNIQUE,client_id CHAR(36) NOT NULL,lawyer_id CHAR(36) NOT NULL,rating TINYINT NOT NULL,comment VARCHAR(2000),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(appointment_id) REFERENCES appointments(id),FOREIGN KEY(client_id) REFERENCES users(id),FOREIGN KEY(lawyer_id) REFERENCES users(id),CHECK(rating BETWEEN 1 AND 5));
CREATE TABLE IF NOT EXISTS notifications (id CHAR(36) PRIMARY KEY,user_id CHAR(36) NOT NULL,title VARCHAR(200) NOT NULL,message VARCHAR(2000) NOT NULL,type VARCHAR(50) NOT NULL,read_at TIMESTAMP NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id),INDEX idx_notifications_user(user_id,created_at));
CREATE TABLE IF NOT EXISTS consents (id CHAR(36) PRIMARY KEY,user_id CHAR(36) NOT NULL,consent_type VARCHAR(80) NOT NULL,version VARCHAR(40) NOT NULL,granted BOOLEAN NOT NULL,granted_at TIMESTAMP NULL,withdrawn_at TIMESTAMP NULL,FOREIGN KEY(user_id) REFERENCES users(id),INDEX idx_consent_user(user_id));
CREATE TABLE IF NOT EXISTS audit_logs (id CHAR(36) PRIMARY KEY,actor_user_id CHAR(36) NULL,action VARCHAR(120) NOT NULL,resource VARCHAR(120) NOT NULL,resource_id VARCHAR(100),outcome ENUM('SUCCESS','DENIED','FLAGGED') NOT NULL,ip_address VARCHAR(64),correlation_id VARCHAR(100),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(actor_user_id) REFERENCES users(id),INDEX idx_audit_actor(actor_user_id,created_at),INDEX idx_audit_resource(resource,resource_id));
CREATE TABLE IF NOT EXISTS security_events (id CHAR(36) PRIMARY KEY,user_id CHAR(36) NULL,event_type VARCHAR(100) NOT NULL,ip_address VARCHAR(64),metadata_json JSON,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id),INDEX idx_security_events(user_id,created_at));
CREATE TABLE IF NOT EXISTS legal_sources (id CHAR(36) PRIMARY KEY,title VARCHAR(255) NOT NULL,publisher VARCHAR(255) NOT NULL,url VARCHAR(1000) NOT NULL,source_version VARCHAR(100),verified_at TIMESTAMP NULL,is_active BOOLEAN NOT NULL DEFAULT TRUE,UNIQUE KEY uq_legal_sources_url (url(750)));
CREATE TABLE IF NOT EXISTS legal_source_chunks (id CHAR(36) PRIMARY KEY,source_id CHAR(36) NOT NULL,chunk_text TEXT NOT NULL,keywords VARCHAR(1000),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(source_id) REFERENCES legal_sources(id) ON DELETE CASCADE,FULLTEXT KEY ft_chunk(chunk_text,keywords));
CREATE TABLE IF NOT EXISTS ai_sessions (id CHAR(36) PRIMARY KEY,user_id CHAR(36) NOT NULL,case_id CHAR(36) NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id),FOREIGN KEY(case_id) REFERENCES cases(id));
CREATE TABLE IF NOT EXISTS ai_messages (id CHAR(36) PRIMARY KEY,session_id CHAR(36) NOT NULL,role VARCHAR(20) NOT NULL,content TEXT NOT NULL,citation_count INT NOT NULL DEFAULT 0,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(session_id) REFERENCES ai_sessions(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS ai_evaluations (id CHAR(36) PRIMARY KEY,scenario_id VARCHAR(100) NOT NULL,metric VARCHAR(100) NOT NULL,score DECIMAL(8,4) NOT NULL,evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);

-- NyayaConnect 4.0 modern legal-tech extensions
CREATE TABLE IF NOT EXISTS lawyer_verification (
  id CHAR(36) PRIMARY KEY,
  lawyer_id CHAR(36) NOT NULL,
  verification_type VARCHAR(80) NOT NULL,
  document_reference VARCHAR(500),
  status ENUM('PENDING','UNDER_REVIEW','VERIFIED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  reviewed_by CHAR(36) NULL,
  reviewed_at TIMESTAMP NULL,
  expiry_at DATE NULL,
  review_note VARCHAR(1000),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY(reviewed_by) REFERENCES users(id),
  INDEX idx_lawyer_verification_status(lawyer_id,status)
);

CREATE TABLE IF NOT EXISTS case_parties (
  id CHAR(36) PRIMARY KEY,
  case_id CHAR(36) NOT NULL,
  user_id CHAR(36) NULL,
  party_name VARCHAR(180) NOT NULL,
  party_type ENUM('CLIENT','OPPOSING_PARTY','WITNESS','OTHER') NOT NULL,
  contact_reference VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id),
  INDEX idx_case_parties_case(case_id)
);

CREATE TABLE IF NOT EXISTS case_messages (
  id CHAR(36) PRIMARY KEY,
  case_id CHAR(36) NOT NULL,
  sender_user_id CHAR(36) NOT NULL,
  message_text TEXT NOT NULL,
  attachment_document_id CHAR(36) NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY(sender_user_id) REFERENCES users(id),
  FOREIGN KEY(attachment_document_id) REFERENCES documents(id),
  INDEX idx_case_messages_case(case_id,created_at)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL UNIQUE,
  email_consultations BOOLEAN NOT NULL DEFAULT TRUE,
  sms_reminders BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_alerts BOOLEAN NOT NULL DEFAULT FALSE,
  hearing_date_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  document_updates BOOLEAN NOT NULL DEFAULT TRUE,
  security_login_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) PRIMARY KEY,
  case_id CHAR(36) NULL,
  appointment_id CHAR(36) NULL,
  payer_user_id CHAR(36) NOT NULL,
  payee_user_id CHAR(36) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  provider VARCHAR(40),
  provider_reference VARCHAR(160),
  status ENUM('PENDING','AUTHORIZED','CAPTURED','FAILED','REFUND_PENDING','REFUNDED','DISPUTED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(case_id) REFERENCES cases(id),
  FOREIGN KEY(appointment_id) REFERENCES appointments(id),
  FOREIGN KEY(payer_user_id) REFERENCES users(id),
  FOREIGN KEY(payee_user_id) REFERENCES users(id),
  INDEX idx_payments_payer(payer_user_id,created_at)
);

CREATE TABLE IF NOT EXISTS invoices (
  id CHAR(36) PRIMARY KEY,
  payment_id CHAR(36) NULL,
  case_id CHAR(36) NULL,
  invoice_number VARCHAR(80) NOT NULL UNIQUE,
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  status ENUM('DRAFT','ISSUED','PAID','VOID') NOT NULL DEFAULT 'DRAFT',
  issued_at TIMESTAMP NULL,
  FOREIGN KEY(payment_id) REFERENCES payments(id),
  FOREIGN KEY(case_id) REFERENCES cases(id)
);

CREATE TABLE IF NOT EXISTS review_moderation (
  id CHAR(36) PRIMARY KEY,
  review_id CHAR(36) NOT NULL UNIQUE,
  moderation_status ENUM('PENDING','APPROVED','REJECTED','FLAGGED') NOT NULL DEFAULT 'PENDING',
  reason VARCHAR(1000),
  reviewed_by CHAR(36) NULL,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY(reviewed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS privacy_data_requests (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  request_type ENUM('EXPORT','DELETE','WITHDRAW_CONSENT','ACCESS') NOT NULL,
  status ENUM('REQUESTED','IN_REVIEW','COMPLETED','REJECTED') NOT NULL DEFAULT 'REQUESTED',
  reason VARCHAR(1000),
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY(user_id) REFERENCES users(id),
  INDEX idx_privacy_requests_user(user_id,requested_at)
);

CREATE TABLE IF NOT EXISTS ai_case_briefs (
  id CHAR(36) PRIMARY KEY,
  case_id CHAR(36) NOT NULL,
  created_by CHAR(36) NOT NULL,
  language VARCHAR(40) NOT NULL DEFAULT 'English',
  summary TEXT NOT NULL,
  facts_json JSON,
  document_ids_json JSON,
  questions_json JSON,
  safety_note VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY(created_by) REFERENCES users(id),
  INDEX idx_ai_brief_case(case_id,created_at)
);

CREATE TABLE IF NOT EXISTS ai_document_queries (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  case_id CHAR(36) NULL,
  document_id CHAR(36) NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  source_verified BOOLEAN NOT NULL DEFAULT FALSE,
  citation_json JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(case_id) REFERENCES cases(id),
  FOREIGN KEY(document_id) REFERENCES documents(id),
  INDEX idx_ai_doc_queries_user(user_id,created_at)
);
