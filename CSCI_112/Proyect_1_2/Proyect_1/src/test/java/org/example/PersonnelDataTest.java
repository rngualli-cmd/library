package org.example;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PersonnelDataTest {

    @Test
    void getName() {
        PersonnelData personal=new PersonnelData("Roberto","Data Science",1999);
        assertEquals("Roberto",personal.getName());
        // create a new Personal data and then test if Roberto match with Roberto


        // test if there is data there
        assertNotNull(personal.getName());
    }

    @Test
    void setName() {
        PersonnelData personal=new PersonnelData("Roberto","Data Science",1999);
        personal.setName("Fernando");
        assertEquals("Fernando",personal.getName());
        //create a new Personal data and then test if Roberto change to Fernando

        //The same as the other one but test the opposite.
        assertNotEquals("Roberto", personal.getName());
    }

    @Test
    void getJobtitle() {

        PersonnelData personal=new PersonnelData("Roberto","Data Science",1999);
        assertEquals("Data Science",personal.getJobtitle());
        // Test job description String
    }

    @Test
    void setJobtitle() {
        PersonnelData personal=new PersonnelData("Roberto","Data Science",1999);
        personal.setJobtitle("Arts");

        assertEquals("Arts",personal.getJobtitle());
        // Test job description changes
    }

    @Test
    void getBirth() {
        PersonnelData personal=new PersonnelData("Roberto","Data Science",1999);

        assertEquals(1999,personal.getBirth());

        // test years data
    }


    @Test
    void setBirth() {
        PersonnelData personal=new PersonnelData("Roberto","Data Science",1999);
        personal.setBirth(2004);

        assertEquals(2004,personal.getBirth());
        // test years data changes
    }
}