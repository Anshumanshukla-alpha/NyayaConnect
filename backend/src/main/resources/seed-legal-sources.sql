SET NAMES utf8mb4;
USE nyayaconnect;

-- Demonstration source index. Production deployments must establish a governed refresh/review process.
INSERT IGNORE INTO legal_sources(id,title,publisher,url,source_version,verified_at,is_active) VALUES
('80000000-0000-0000-0000-000000000001','The Negotiable Instruments Act, 1881','India Code','https://www.indiacode.nic.in/bitstream/123456789/2189/1/a1881-26.pdf','India Code indexed 2026-10',CURRENT_TIMESTAMP,TRUE),
('80000000-0000-0000-0000-000000000002','The Consumer Protection Act, 2019','India Code','https://www.indiacode.nic.in/bitstream/123456789/15256/1/eng201935.pdf','India Code indexed 2026-10',CURRENT_TIMESTAMP,TRUE),
('80000000-0000-0000-0000-000000000003','India Code — Central Act Legislation','Ministry of Law and Justice, Government of India','https://www.indiacode.nic.in/indiacode/home.jsp','Government source index 2026-10',CURRENT_TIMESTAMP,TRUE);

INSERT IGNORE INTO legal_source_chunks(id,source_id,chunk_text,keywords) VALUES
('81000000-0000-0000-0000-000000000001','80000000-0000-0000-0000-000000000001','The Negotiable Instruments Act, 1881 contains provisions concerning promissory notes, bills of exchange and cheques. The source should be checked for the current statutory text and applicable procedural requirements before legal reliance.','cheque bounce dishonour negotiable instruments section 138 payment notice'),
('81000000-0000-0000-0000-000000000002','80000000-0000-0000-0000-000000000002','The Consumer Protection Act, 2019 provides a statutory framework for protection of consumer interests and administration and settlement of consumer disputes. The source should be checked for the current text and applicable forum before legal reliance.','consumer complaint service deficiency consumer dispute forum'),
('81000000-0000-0000-0000-000000000003','80000000-0000-0000-0000-000000000003','India Code is the Government of India legal information portal for central legislation and related legislative material. Users should verify the current official text and applicable rules, notifications and amendments before relying on a provision.','india code central act legislation official law statute government');
