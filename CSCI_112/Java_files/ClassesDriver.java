public class ClassesDriver {
    public static void main(String[] args) {
        /** Aggregation */
        Person per1 = new Person();
            /** This class "PartsDriver" now "has an" instance
             of a Person Object. This class can now access to all
             the methods in the Person class using the variable
             per1 */
        per1.setName("Bob");
        per1.setAge(20);


        System.out.println("Name: " + per1.getName() + " age: " + per1.getAge());
        System.out.println();

            /** Using the Person class a second time */
        Person per2 = new Person("Ari", 18);
        System.out.println(per2.toString());
        System.out.println();


            /** example using the "static" keyword  */

        Person[] people = new Person[6];

        people[0] = new Person("Mei", 25);
        people[1] = new Person("Feng", 86);
        people[2] = new Person("Jen", 45);
        people[3] = new Person("Tyron", 23);
        people[4] = new Person("Kyra", 19);
        people[5] = new Person("Steve");

        for(int i = 0; i < people.length; i++) {
            System.out.println(people[i].toString());
        }

        System.out.println();

        // Objects and copies
        Person[] peop;

        peop = people;
        /** does this make a copy of the original array,
         so that there are two arrays in memory? */

        /** using peop array (the second array), I'll make a change */
        peop[2].setName("Beth");
        System.out.println("Third name now in second array " + peop[2].getName());
        System.out.println();

        /** then print the value in the people array (the first array) */
        System.out.println(people[2].toString());
        System.out.println();
    }
}
