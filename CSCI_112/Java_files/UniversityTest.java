import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UniversityTest {

    @Test
    void noArgConstructor() {
        University uni = new University();
        assertNotNull(uni);
    }

    @Test
    void paramConstructor() {
        University uni = new University("Ole Miss");
        assertAll(
                () -> assertEquals("Ole Miss", uni.getUniName()),
                () -> assertNotNull(uni)
        );
    }
    @Test
    void setUniName() {
        University uni = new University();
        uni.setUniName("Ole Miss");
        assertEquals("Ole Miss", uni.getUniName());
    }

    @Test
    void addGroupToList() {
        University uni = new University();
        uni.addGroupToList("ACM");
        assertNotNull(uni.getGroupFromUniList(0));
    }

    @Test
    void addPersonToGroup() {
        University uni = new University();
        uni.addGroupToList("");
        uni.addPersonToGroup("Bob",20, 0);
        assertNotNull(uni.getPersonFromUniGroup(0, 0));
    }
}