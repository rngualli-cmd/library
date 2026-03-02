
public class Person {

    /**
     class attributes, declared only
     */
    private String name;
    private int age;

    /**
     The 4 primary methods of an Object Class
        Constructor
        Accessor - getter
        Mutator - setter
        toString

     No-Arg parameter list Constructor
     */
    public Person(){
        name = "";
        age = 0;
    }

    /**
     parameterized parameter list Constructor
     */
    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }

    /**
      Mutators (setters)
     */
    public void setName(String Name){
        name = Name;
    }

    public void setAge(int Age){
        age = Age;
    }


    /**
        Accessors (getters)
     */

    public String getName(){
        return name;
    }

    public int getAge(){
        return age;
    }

    /**
        toString
     */
    public String toString(){
        return String.format("Name: %-10s age: %d", name, age);
    }
}
