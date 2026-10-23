<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>NyayaConnect Admin</title><style>body{font-family:system-ui;margin:40px;line-height:1.5}main{max-width:900px;margin:auto}code{background:#eee;padding:2px 6px}</style></head>
<body><main><h1>NyayaConnect Admin Console</h1><p>Signed in as <strong><c:out value="${admin.name}"/></strong> (<c:out value="${admin.email}"/>).</p><p>This server-rendered view demonstrates the mandatory JSP/JSTL layer. Operational admin APIs should be added behind the same server-side RBAC policy.</p></main></body></html>
