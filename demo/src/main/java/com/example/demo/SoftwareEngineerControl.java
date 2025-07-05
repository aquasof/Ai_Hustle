package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/v1/software-engineers")
public class SoftwareEngineerControl {


    @GetMapping
    public List<SoftwareEngineer> getSoftwareEngineers() {

        return List.of(
                new SoftwareEngineer(
                        1,
                        "Mely",
                        "Js, Node, React"
                ),
                new SoftwareEngineer(
                        2,
                        "Jely",
                        "Js, Node, Python"
                )
        );
    }
}
