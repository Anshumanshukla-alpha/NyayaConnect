package com.nyayaconnect.config;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import javax.sql.DataSource;
@Configuration
public class DatabaseConfig {
  @Bean(destroyMethod="close")
  public DataSource dataSource() {
    HikariConfig c = new HikariConfig();
    c.setDriverClassName("com.mysql.cj.jdbc.Driver");
    boolean production = "production".equalsIgnoreCase(System.getenv().getOrDefault("APP_ENV", "local"));
    String url = env("DB_URL", "jdbc:mysql://localhost:3306/nyayaconnect?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC");
    String user = env("DB_USER", "nyaya_app");
    String password = env("DB_PASSWORD", "change-me");
    if (production) {
      if (System.getenv("DB_URL") == null || System.getenv("DB_USER") == null || System.getenv("DB_PASSWORD") == null
          || password.isBlank() || password.equals("change-me") || user.equals("root")) {
        throw new IllegalStateException("Production requires explicit DB_URL, least-privilege DB_USER, and a non-placeholder DB_PASSWORD.");
      }
      String lowerUrl = url.toLowerCase(java.util.Locale.ROOT);
      if (lowerUrl.contains("usessl=false") || lowerUrl.contains("sslmode=disabled") || lowerUrl.contains("allowpublickeyretrieval=true")) {
        throw new IllegalStateException("Production DB_URL must use verified TLS and must not enable allowPublicKeyRetrieval.");
      }
      if (!(lowerUrl.contains("sslmode=verify_ca") || lowerUrl.contains("sslmode=verify_identity"))) {
        throw new IllegalStateException("Production DB_URL must set sslMode=VERIFY_CA or sslMode=VERIFY_IDENTITY for certificate verification.");
      }
    }
    c.setJdbcUrl(url);
    c.setUsername(user); c.setPassword(password);
    c.setMaximumPoolSize(Integer.parseInt(env("DB_POOL_MAX", "15"))); c.setMinimumIdle(2); c.setConnectionTimeout(10000);
    c.setValidationTimeout(3000); c.setLeakDetectionThreshold(15000); c.setPoolName("NyayaConnectPool");
    return new HikariDataSource(c);
  }
  @Bean public JdbcTemplate jdbcTemplate(DataSource ds) { return new JdbcTemplate(ds); }
  @Bean public PlatformTransactionManager transactionManager(DataSource ds) { return new DataSourceTransactionManager(ds); }
  private static String env(String key, String fallback) { String v=System.getenv(key); return v==null||v.isBlank()?fallback:v; }
}
