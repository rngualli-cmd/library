package org.example;

public class Consultans {

    public static final int year_2026 = 2026;
    private PersonnelData[] personnelList;
    private int count;
    private String Ciel;


    public Consultans(String Ciel) {
        this.Ciel = Ciel;
        this.personnelList = new PersonnelData[40];
        this.count = 0;


    }

    public void addPersonnelData(PersonnelData data) {
        this.personnelList[count] = data;
        count++;
        // add data to the array


    }

    public double getAverage() {

        // calculates the average sum and the div
        double Total = 0;

        for (int i = 0; i < count; i++) {
            int age = 2026 - personnelList[i].getBirth();
            Total += age;


        }
        return Total / count;
    }

    public PersonnelData getOldest() {

        //so I am not good at loops, but this loop find a way to find the one that born the earliest, and then you get the oldest

        PersonnelData old = personnelList[0];
        for (int i = 0; i < count; i++) {
            if (personnelList[i].getBirth() < old.getBirth()) {
                old = personnelList[i];
            }


        }
        return old;


    }
    public PersonnelData getYoungest() {
        // this loop find a way to find the one that born the last, and then you get the youngest
        PersonnelData young = personnelList[0];

        for (int i = 0; i < count; i++) {
            if (personnelList[i].getBirth() > young.getBirth()) {
                young = personnelList[i];


            }
        }
        return young;

        }

        public void printAll() {
        for (int i = 0; i < count; i++) {
            int age = year_2026 - personnelList[i].getBirth();
            System.out.println(personnelList[i].getName() + " is: " + age + " years old      " + "Day of birth is :   " + personnelList[i].getBirth() + "       POSITION:    " + personnelList[i].getJobtitle());
        }
        System.out.printf("Average age in Ciel : %.2f%n ", getAverage());
        System.out.println("Youngest in the business : " + getYoungest().getName() + " with " + (year_2026 - getYoungest().getBirth()) + " years old");
        System.out.println("Oldest in the business : " + getOldest().getName() + " with " + (year_2026 - getOldest().getBirth()) + " years old");
        System.out.println(" The number of employees is : " + count);
    }

        //getters so this is accesiable

        public String getCiel(){return Ciel;}
    public int getCount(){return count;}
    public PersonnelData[] getPersonnelList(){return personnelList;}


}
