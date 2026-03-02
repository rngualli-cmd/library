package org.example;

public class PersonnelData {


    private String name;
    private String jobtitle;
    private int birth;

    //this creates a public class with the personal data, 3 privates attributes with a constructor and setters and getters


    public PersonnelData(String name, String jobtitle, int birth) {
        this.name = name;
        this.jobtitle = jobtitle;
        this.birth = birth;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getJobtitle() {
        return jobtitle;
    }

    public void setJobtitle(String jobtitle) {
        this.jobtitle = jobtitle;
    }

    public int getBirth() {
        return birth;
    }

    public void setBirth(int birth) {
        this.birth = birth;
    }
}