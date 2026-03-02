import java.util.ArrayList;

public class University {
    private String uniName;
    private ArrayList<Group> groups;

    // No-arg Const
    public University(){
        uniName = "";
        groups = new ArrayList<>();
    }

    // Parameterized Const
    public University(String name){
        uniName = name;
        groups = new ArrayList<>();
    }

    // setter and getter for uniName
    public void setUniName(String uniName) {
        this.uniName = uniName;
    }

    public String getUniName() {
        return uniName;
    }

    public void addGroupToList(String groupName){
        groups.add(new Group(groupName));
    }

    public void addPersonToGroup(String personName, int age, int index){
        groups.get(index).addPersonToArray(personName, age);
    }

    public void printUniData() {
        System.out.println(uniName);
        for (int i = 0; i < groups.size(); i++) {
            groups.get(i).printGroup();
            System.out.println();
        }
    }


    public Group getGroupFromUniList(int i) {
        return groups.get(0);
    }


    public Person getPersonFromUniGroup(int i, int index) {
        return groups.get(0).getCellFromArray(0);
    }
}
