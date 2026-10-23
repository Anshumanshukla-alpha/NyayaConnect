SET NAMES utf8mb4;
USE nyayaconnect;

-- Demo credentials for local evaluation only. Password for all demo users: DemoPass123!
-- Replace/remove this file for any non-demo deployment.
INSERT IGNORE INTO users(id,name,email,password_hash,role,blocked,phone,city,state)
VALUES
('00000000-0000-0000-0000-000000000001','Rahul Sharma','rahul@demo.nyayaconnect.local','$2y$12$PZrAP2wP7JHBkXGDa0O.seFKQnqAoCAhVd1nJ24PbGJhU20jTyp/i','CLIENT',false,'+91 98112 34567','New Delhi','Delhi'),
('00000000-0000-0000-0000-000000000002','Adv. Priya Nair','priya@demo.nyayaconnect.local','$2y$12$PZrAP2wP7JHBkXGDa0O.seFKQnqAoCAhVd1nJ24PbGJhU20jTyp/i','LAWYER',false,'+91 98201 87654','New Delhi','Delhi'),
('00000000-0000-0000-0000-000000000003','NyayaConnect Admin','admin@demo.nyayaconnect.local','$2y$12$PZrAP2wP7JHBkXGDa0O.seFKQnqAoCAhVd1nJ24PbGJhU20jTyp/i','ADMIN',false,'+91 1100000000','New Delhi','Delhi');

INSERT IGNORE INTO lawyer_profiles(id,user_id,bar_council_number,verification_status,bio,experience_years,city,court,consultation_fee,rating,review_count)
VALUES('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','DEMO/DEL/2012','VERIFIED','Property, civil and consumer law practitioner for the NyayaConnect demonstration environment.',14,'New Delhi','Delhi High Court & District Courts',1500,4.9,84);
INSERT IGNORE INTO lawyer_practice_areas(lawyer_id,practice_area) VALUES
('10000000-0000-0000-0000-000000000001','Property & Real Estate Law'),
('10000000-0000-0000-0000-000000000001','Civil Litigation'),
('10000000-0000-0000-0000-000000000001','Consumer Protection');
INSERT IGNORE INTO lawyer_languages(lawyer_id,language_name) VALUES
('10000000-0000-0000-0000-000000000001','English'),
('10000000-0000-0000-0000-000000000001','Hindi');
INSERT IGNORE INTO lawyer_availability(id,lawyer_id,weekday,starts_at,ends_at) VALUES
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',1,'10:00:00','18:00:00'),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001',2,'10:00:00','18:00:00'),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001',3,'10:00:00','18:00:00'),
('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001',4,'10:00:00','18:00:00'),
('20000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001',5,'10:00:00','18:00:00');

INSERT IGNORE INTO cases(id,case_number,title,category,description,client_id,lawyer_id,status,opened_at)
VALUES('30000000-0000-0000-0000-000000000001','NYA-2026-DEL-001','Sharma vs. Gupta — Security Deposit Recovery','Tenancy & Rental Dispute','Recovery of a refundable security deposit after peaceful handover. This demo record is for product evaluation only.','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','ACTIVE',NOW());

INSERT IGNORE INTO case_tasks(id,case_id,title,status,due_at,assigned_to)
VALUES
('40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Upload signed handover checklist','COMPLETED',DATE_ADD(NOW(),INTERVAL 1 DAY),'00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001','Review demand-notice draft','IN_PROGRESS',DATE_ADD(NOW(),INTERVAL 3 DAY),'00000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000001','Confirm next consultation action','TODO',DATE_ADD(NOW(),INTERVAL 7 DAY),'00000000-0000-0000-0000-000000000001');

INSERT IGNORE INTO appointments(id,case_id,client_id,lawyer_id,starts_at,ends_at,status,client_notes,meeting_provider,meeting_url)
VALUES('50000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002',DATE_ADD(NOW(),INTERVAL 1 DAY),DATE_ADD(DATE_ADD(NOW(),INTERVAL 1 DAY),INTERVAL 30 MINUTE),'CONFIRMED','Security deposit dispute; client has agreement and handover records.','JITSI','https://meet.jit.si/nyayaconnect-demo-500000000001');

INSERT IGNORE INTO case_timeline(id,case_id,event_type,title,description,created_by)
VALUES('60000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','CONSULTATION','Initial consultation scheduled','Initial consultation has been scheduled. Verify all facts and original documents with the advocate.','00000000-0000-0000-0000-000000000002');

INSERT IGNORE INTO notifications(id,user_id,title,message,type)
VALUES
('70000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Upcoming consultation','Your consultation with Adv. Priya Nair is scheduled for tomorrow.','APPOINTMENT'),
('70000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Case action required','Upload the signed handover checklist to keep your case workspace complete.','CASE'),
('70000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000002','New consultation request','A client has an upcoming consultation linked to the security-deposit case.','APPOINTMENT');
