package com.nyayaconnect.ai;
import com.nyayaconnect.auth.SpringAccess;
import com.nyayaconnect.common.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

/** Source-aware legal assistant. It never invents a legal conclusion when no verified source is available. */
public class ChatServlet extends HttpServlet {
 private LegalRetrievalService retrieval;
 public void init(){retrieval=SpringAccess.bean(getServletContext(),LegalRetrievalService.class);}
 protected void doPost(HttpServletRequest req,HttpServletResponse res)throws IOException{
  try{
   Map<?,?> b=Json.MAPPER.readValue(req.getInputStream(),Map.class);
   String q=value(b,"question","").trim();
   if(q.isBlank()){Object ms=b.get("messages");if(ms instanceof List<?> list&&!list.isEmpty()){Object last=list.get(list.size()-1);q=last instanceof Map<?,?> m?value(m,"content",""):String.valueOf(last);}}
   if(q.isBlank())throw new IllegalArgumentException("A question is required.");
   List<LegalRetrievalService.SourceChunk> chunks=retrieval.retrieve(q,5);
   if(chunks.isEmpty()){
     Api.json(res,200,Map.of("answer","I could not verify this question against the configured legal-source index. I will not invent an answer. Please consult a qualified advocate or retry after the verified source index is available.","sourceVerified",false,"citations",List.of()));
     return;
   }
   StringBuilder answer=new StringBuilder("I found the following verified-source material relevant to your question. This is source retrieval, not a legal opinion:\n\n");
   for(LegalRetrievalService.SourceChunk c:chunks) answer.append("• ").append(c.title()).append(" — ").append(c.excerpt()).append("\n");
   Api.json(res,200,Map.of("answer",answer.toString(),"sourceVerified",true,"citations",CitationValidator.toCitations(chunks)));
  }catch(IllegalArgumentException e){Api.error(res,400,"VALIDATION_ERROR",e.getMessage());}
   catch(Exception e){Api.error(res,500,"CHAT_FAILED","Unable to process the request safely.");}
 }
 private static String value(Map<?,?> m,String k,String d){Object v=m.get(k);return v==null?d:String.valueOf(v);}
}
