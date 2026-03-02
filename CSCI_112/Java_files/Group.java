public class Group {

    /**
     The initial set up and methods are basically the same as a Regular Object
        Class. It still contains attributes, constructors, setters, and getter,
        but there usually isn’t a toString method (but it can have one) and one
        attribute is a Regular Object Class object usually as a data structure.
     */

    private String groupName;
    private Person[] people;
    private int logLength;

    public Group(){
        groupName = "";
        people = new Person[100];
        logLength = 0;
    }

    public Group(String name){
        groupName = name;
        people = new Person[100];
        logLength = 0;
    }

    // setter
    public void setGroupName(String name){
        groupName = name;
    }

    public void addPersonToArray(String name, int age){
        people[logLength] = new Person(name, age);
        logLength++;
    }

    // getters
    public String getGroupName(){
        return groupName;
    }

    public int getLogLength(){
        return logLength;
    }


    public void printGroup(){
        System.out.println("The group name: " + groupName);
        for( int i = 0; i < logLength; i++){
            System.out.println(people[i].toString());
        }
        System.out.println();
    }

    // used for junit testing
    public Person getCellFromArray(int i) {
        return people[i];
    }

    public Person[] getArray() {
        return people;
    }

}
