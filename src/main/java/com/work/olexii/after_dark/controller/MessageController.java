package com.work.olexii.after_dark.controller;

import com.work.olexii.after_dark.domain.Message;
import com.work.olexii.after_dark.domain.User;
import com.work.olexii.after_dark.service.FaceToFaceChatService;
import com.work.olexii.after_dark.service.MessageService;
import com.work.olexii.after_dark.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MessageController {


    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private FaceToFaceChatService chatService;

    @GetMapping("/messages")
    public List<Message> getMessages() {
        return messageService.getChatMessages();
    }

    @GetMapping("/usertest")
    public User getOneUser(@RequestParam(value = "id") long id) {
        return userService.getOneUser(id);
    }

    @PostMapping("/messages")
    public List<Message> isChatChanged(@RequestBody List<Message> messages) {
        return messageService.isChatChanged(messages);
    }

    @PostMapping("/msg")
    public Message createMessage(@AuthenticationPrincipal User user, @RequestBody Message message) {
        return messageService.createMessage(user, message);
    }

    @PutMapping("/msg")
    public Message changeMessage(@AuthenticationPrincipal User user, @RequestParam(value = "id") long id,
                                 @RequestBody Message message) {
        return messageService.changeMessage(message, id, user);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/msg")
    public List<Message> deleteMessage(@RequestParam(value = "id") long id) {
        return messageService.deleteMessage(id);
    }

    @GetMapping("/charter")
    public Message getChart() {
        return messageService.getChart();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/charter")
    public Message updateChart(@RequestBody Message message) {
        return messageService.updateChart(message);
    }

    @GetMapping("/recruiting")
    public Message getRecruitingText() {
        return messageService.getRecruitingText();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/recruiting")
    public Message updateRecruitingText(@RequestBody Message message) {
        return messageService.updateRecruitingText(message);
    }

    @PostMapping("/send_request")
    public Message sendRequest(@RequestBody Message message) {
        return messageService.sendRequestToRecruiting(message);
    }

    @PostMapping("/send_request_to_support")
    public Message sendRequestToSupport(@RequestBody Message message) {
        return messageService.sendRequestToSupport(message);
    }

    @GetMapping("/announcements")
    public List<Message> getAllAnnouncements() {
        return messageService.getAllAnnouncements();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/announcements")
    public Message createAnnouncement(@AuthenticationPrincipal User user, @RequestBody Message message) {
        return messageService.createAnnouncement(user, message);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/announcements")
    public Message changeAnnouncement(@AuthenticationPrincipal User user, @RequestParam(value = "id") long id,
                                      @RequestBody Message message) {
        return messageService.changeAnnouncement(message, id, user);
    }


}
