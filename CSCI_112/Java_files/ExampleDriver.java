public class ExampleDriver {

    public static void main(String[] args) {
        /** Aggregation */
        // Person per1 = new Person();
        // per1.setName("Bob");
        // per1.setAge(20);


        // System.out.println("Name: " + per1.getName() + " age: " + per1.getAge());
        // System.out.println();

        //     /** Using the Person class a second time */
        // Person per2 = new Person("Ari", 18);
        // System.out.println(per2.toString());
        // System.out.println();


        // Person[] people = new Person[6];

        // people[0] = new Person("Mei", 25);



//        Group group = new Group("ACM");
//
//        group.addPersonToArray("Bob Burger", 22);
//        group.addPersonToArray("Sue Smith", 18);
//        group.addPersonToArray("Jenna Jones", 20);
//
//        group.printGroup();

        University uni = new University("Ole Miss");

        uni.addGroupToList("ACM");

        uni.addPersonToGroup("Bob Burger", 22, 0);
        uni.addPersonToGroup("Jenna Jones", 20, 0);

        uni.addGroupToList("Marching Band");

        uni.addPersonToGroup("Sue Smith", 18, 1);
    }

}
