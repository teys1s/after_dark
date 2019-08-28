package com.work.olexii.after_dark.controller;

import com.work.olexii.after_dark.domain.Message;
import com.work.olexii.after_dark.domain.User;
import com.work.olexii.after_dark.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MessageController {


    @Autowired
    MessageService messageService;

    @GetMapping("/messages")
    public List<Message> getMessages() {
        return messageService.getChatMessages();
    }

    @PutMapping("/messages")
    public List<Message> isChatChanged(@RequestBody List<Message> messages){
        return messageService.isChatChanged(messages);
    }

    @PostMapping("/msg")
    public Message createMessage(@AuthenticationPrincipal User user, @RequestBody Message message) {
        return messageService.createMessage(user, message);
    }

    @PutMapping("/msg")
    public Message changeMessage(@AuthenticationPrincipal User user, @RequestParam(value = "id")long id,
                                 @RequestBody Message message){
      return   messageService.changeMessage(message,id, user);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/msg")
    public List<Message> deleteMessage(@RequestParam(value = "id") long id){
        return messageService.deleteMessage(id);
    }

    @GetMapping("/charter")
    public Message getChart() {
        return messageService.getChart();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/charter")
    public Message updateChart(@RequestParam(value = "id") long id, @RequestBody Message message) {
        return messageService.updateChart(message, id);
    }

    @GetMapping("/recruiting")
    public Message getRecruitingText() {
        return messageService.getRecruitingText();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/recruiting")
    public Message updateRecruitingText(@RequestParam(value = "id") long id, @RequestBody Message message) {
        return messageService.updateRecruitingText(message, id);
    }

    @PostMapping("/send_request")
    public Message sendRequest(@RequestBody Message message) {
        return messageService.sendRequest(message);
    }

    @GetMapping("/announcements")
    public List<Message> getAllAnnouncements(){
        return messageService.getAllAnnouncements();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/announcements")
    public Message createAnnouncement(@AuthenticationPrincipal User user, @RequestBody Message message){
        return messageService.createAnnouncement(user, message);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/announcements")
    public Message changeAnnouncement(@AuthenticationPrincipal User user, @RequestParam(value = "id")long id,
                                      @RequestBody Message message){
       return messageService.changeAnnouncement(message,id,user);
    }
}
