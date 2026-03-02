package org.example;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ConsultansTest {

    @Test
    void addPersonnelData() {

        //check the array position adding a Personnel data
        Consultans consultans= new Consultans("Roberto1");
        PersonnelData per =new PersonnelData("Juan","Arts",1997);
        consultans.addPersonnelData(per);
        //don't forget to do research on how to call array in the assert Equals
        assertEquals(1,consultans.getCount());
        assertEquals(per,consultans.getPersonnelList()[0]);

        // I can also test if a number was created in the array
        assertNotNull(consultans.getPersonnelList()[0]);



    }

    @Test
    void getAverage() {
        Consultans consultans= new Consultans("Roberto1");

        // solve error java.lang.StackOverflowError before wensday
        // add two PersonnelData and then add to consultans, the test if the average was 28 calling the .get averague
        PersonnelData per =new PersonnelData("Juan","Arts",1997);
        PersonnelData per2 =new PersonnelData("Juan","Arts",1999);
        consultans.addPersonnelData(per);
        consultans.addPersonnelData(per2);

        assertEquals(28,consultans.getAverage());


        // I can test if there is a number that match with this also

        assertTrue(consultans.getAverage() >= 28);





    }

    @Test
    void getOldest() {

        // add two PersonnelData and then add to consultans, then test if the data that I put in PersonnelData matches with the oldest, calling .get oldest
        Consultans consultans= new Consultans("Roberto1");
        PersonnelData oldest =new PersonnelData("Juan","Arts",1997);
        PersonnelData younguest =new PersonnelData("Juan","Arts",1999);
        consultans.addPersonnelData(oldest);
        consultans.addPersonnelData(younguest);
        assertEquals(oldest,consultans.getOldest());


    }

    @Test
    void getYoungest() {
        // add two PersonnelData and then add to consultans, then test if the data that I put in PersonnelData matches with the younguest, calling .getYoungest
        Consultans consultans= new Consultans("Roberto1");
        PersonnelData oldest =new PersonnelData("Juan","Arts",1997);
        PersonnelData younguest =new PersonnelData("Juan","Arts",1999);
        consultans.addPersonnelData(oldest);
        consultans.addPersonnelData(younguest);
        assertEquals(younguest ,consultans.getYoungest());
    }

    @Test
    void getCiel() {

        // tset the name of the company
        Consultans consultans= new Consultans("Roberto1");
        assertEquals("Roberto1",consultans.getCiel());


        // it returns roberto so is not null
        assertNotNull(consultans.getCiel());



    }

    @Test
    void getCount() {
        //so if I add 1 person need to match that we have 1 person
        Consultans consultans= new Consultans("Roberto1");
        PersonnelData per =new PersonnelData("Juan","Arts",1997);
        consultans.addPersonnelData(per);

        assertEquals(1,consultans.getCount());

    }

    @Test
    void getPersonnelList() {
        // I was stuck here a little bit cause i thought the array was gonna be of the lenght of the data I put there ( we learn that with  other type of code ) , but here just check if the array initiate and check if the data is the array
        Consultans consultans= new Consultans("Roberto1");
        PersonnelData per1 =new PersonnelData("Juan","Arts",1997);
        PersonnelData per2 =new PersonnelData("Juan2","Arts2",1992);
        PersonnelData per3 =new PersonnelData("Juan3","Arts3",1993);
        consultans.addPersonnelData(per1);
        consultans.addPersonnelData(per2);
        consultans.addPersonnelData(per3);



        assertEquals(40,consultans.getPersonnelList().length);
        assertEquals(per1,consultans.getPersonnelList()[0]);




    }
}