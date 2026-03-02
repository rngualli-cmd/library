/*
Name: Roberto Guallichico
Current Date: 02/27/2026
Sources Consulted: I consulted arrays and loops with videos in Youtube (Brocode/CodingwithJohn) until I was able to do it,
DO-switch was more difficult than I thought, I am bad at doing loops but I got help from friends. I use code from the blackboard re adapted and
then use it here, just like I do in lab.

By submitting this work, I attest that it is my original work and that I did
not violate the University of Mississippi academic policies set forth in the
M book.
*/

package org.example;

import java.util.Scanner;

public class P1Driver {
    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        Consultans MyComp = new Consultans("Ciel Consulting");

        MyComp.addPersonnelData(new PersonnelData("Tyree Dach", "Accountability Supervisor", 1983));
        MyComp.addPersonnelData(new PersonnelData("Deangelo Klocko", "Communications Strategist", 1990));
        MyComp.addPersonnelData(new PersonnelData("Jackeline Bradtke", "Optimization Associate ", 1988));
        MyComp.addPersonnelData(new PersonnelData("Lurline Huels", "Response Agent ", 1996));
        MyComp.addPersonnelData(new PersonnelData("Joaquin Boyer", "Intranet Analyst", 1982));
        MyComp.addPersonnelData(new PersonnelData("Dejuan Schumm DDS", "Research Designer", 1995));
        MyComp.addPersonnelData(new PersonnelData("Bethany Collier", "Program Analyst", 1972));
        MyComp.addPersonnelData(new PersonnelData("Ransom Ruecker V", "Applications Officer", 1986));
        MyComp.addPersonnelData(new PersonnelData("Adrianna Romaguera Jr.", "Branding Specialist", 1967));
        MyComp.addPersonnelData(new PersonnelData("Curtis Greenfelder", "Creative Strategist", 1979));
        MyComp.addPersonnelData(new PersonnelData("Mrs. Brenna Bergnaum", "Applications Developer", 1994));
        MyComp.addPersonnelData(new PersonnelData("Hunter Beier DVM", "Marketing Orchestrator", 1978));



        //THIS CREATES A LITTLE MENU SO YOU CAN CHOOSE 1 TO SEE THE DATA 2 TO EXIT

        System.out.println("Welcome to CIEL LLC");
        int ask;


        do {
            System.out.println("Press 1 to see the data");
            System.out.println("Press 2 to exit");
            ask = scanner.nextInt();


            // in this version I just put the print part in the consultans that I forgot to do it

            switch (ask) {
                case 1:
                    MyComp.printAll();
                    break;



                case 2:
                    System.out.println("Bye Bye");
                    break;

                default:
                    System.out.println("Invalid option");
            }
        } while (ask != 2);
    }
}