# Python script to build src/data/questions.ts from Krishna Janamotsav 400 MCQs
import json
import re

raw_data = """
1. Where was Lord Krishna born?
A. Ayodhya
B. Mathura
C. Dwarka
D. Vrindavan
✓ Correct Answer: B. Mathura

2. Who was Krishna's biological father?
A. Nanda Maharaj
B. Vasudeva
C. Ugrasena
D. Akrura
✓ Correct Answer: B. Vasudeva

3. Who was Krishna's biological mother?
A. Yashoda
B. Devaki
C. Kunti
D. Rohini
✓ Correct Answer: B. Devaki

4. Who was Krishna's foster father in Gokul?
A. Vasudeva
B. Nanda Maharaj
C. Ugrasena
D. Balarama
✓ Correct Answer: B. Nanda Maharaj

5. Who was Krishna's foster mother?
A. Devaki
B. Yashoda
C. Rukmini
D. Rohini
✓ Correct Answer: B. Yashoda

6. Which cruel king imprisoned Devaki and Vasudeva?
A. Jarasandha
B. Kamsa
C. Shishupala
D. Duryodhana
✓ Correct Answer: B. Kamsa

7. Who was Krishna's elder brother?
A. Arjuna
B. Balarama
C. Karna
D. Uddhava
✓ Correct Answer: B. Balarama

8. On which lunar day is Krishna Janmashtami traditionally celebrated?
A. Ekadashi
B. Amavasya
C. Ashtami
D. Purnima
✓ Correct Answer: C. Ashtami

9. Krishna was born in which yuga?
A. Satya Yuga
B. Treta Yuga
C. Dvapara Yuga
D. Kali Yuga
✓ Correct Answer: C. Dvapara Yuga

10. What was the prison city where Krishna was born?
A. Mathura
B. Hastinapura
C. Indraprastha
D. Dwarka
✓ Correct Answer: A. Mathura

11. Who carried baby Krishna across the Yamuna to Gokul?
A. Nanda
B. Vasudeva
C. Akrura
D. Uddhava
✓ Correct Answer: B. Vasudeva

12. Which river did Vasudeva cross with baby Krishna?
A. Ganga
B. Yamuna
C. Saraswati
D. Godavari
✓ Correct Answer: B. Yamuna

13. Who protected Vasudeva and baby Krishna with his hoods during the journey?
A. Garuda
B. Ananta Shesha
C. Hanuman
D. Nandi
✓ Correct Answer: B. Ananta Shesha

14. Which demoness came disguised as a nurse to kill Krishna?
A. Putana
B. Trinavarta
C. Bakasura
D. Aghasura
✓ Correct Answer: A. Putana

15. How did Putana try to kill baby Krishna?
A. Poisoned milk
B. A sword
C. Fire
D. A snake
✓ Correct Answer: A. Poisoned milk

16. Which demon came in the form of a whirlwind?
A. Dhenukasura
B. Trinavarta
C. Kesi
D. Arishtasura
✓ Correct Answer: B. Trinavarta

17. Who was Krishna's childhood friend and beloved devotee known for bringing chipped rice?
A. Sudama
B. Uddhava
C. Vidura
D. Sanjaya
✓ Correct Answer: A. Sudama

18. What was Krishna famous for stealing as a child?
A. Gold
B. Butter
C. Weapons
D. Books
✓ Correct Answer: B. Butter

19. What is Krishna's childhood form in Vrindavan often called?
A. Bala Krishna
B. Kalki
C. Vamana
D. Narasimha
✓ Correct Answer: A. Bala Krishna

20. Which hill did Krishna lift to protect the residents of Vrindavan?
A. Kailasa
B. Govardhana
C. Mandara
D. Meru
✓ Correct Answer: B. Govardhana

21. How many days did Krishna traditionally hold Govardhana Hill?
A. 3
B. 5
C. 7
D. 10
✓ Correct Answer: C. 7

22. Whose pride was humbled during the Govardhana pastime?
A. Agni
B. Indra
C. Varuna
D. Yama
✓ Correct Answer: B. Indra

23. What festival commemorates Krishna's lifting of Govardhana?
A. Holi
B. Govardhan Puja
C. Diwali
D. Ratha Yatra
✓ Correct Answer: B. Govardhan Puja

24. Which serpent was subdued by Krishna in the Yamuna?
A. Kaliya
B. Vasuki
C. Takshaka
D. Shesha
✓ Correct Answer: A. Kaliya

25. What did Krishna do on Kaliya's hoods?
A. Slept
B. Danced
C. Built a temple
D. Placed a crown
✓ Correct Answer: B. Danced

26. Which demon came in the form of a calf?
A. Vatsasura
B. Bakasura
C. Aghasura
D. Kesi
✓ Correct Answer: A. Vatsasura

27. Which demon came in the form of a crane?
A. Bakasura
B. Kesi
C. Dhenukasura
D. Putana
✓ Correct Answer: A. Bakasura

28. Which demon came in the form of a huge python?
A. Aghasura
B. Arishtasura
C. Trinavarta
D. Pralambasura
✓ Correct Answer: A. Aghasura

29. Which demon came in the form of a bull?
A. Kesi
B. Arishtasura
C. Bakasura
D. Vatsasura
✓ Correct Answer: B. Arishtasura

30. Which demon came in the form of a horse?
A. Kesi
B. Aghasura
C. Dhenukasura
D. Kaliya
✓ Correct Answer: A. Kesi

31. Which demon lived in the Talavana forest in the form of a donkey?
A. Dhenukasura
B. Putana
C. Kamsa
D. Shishupala
✓ Correct Answer: A. Dhenukasura

32. Who was sent by Kamsa to bring Krishna and Balarama to Mathura?
A. Akrura
B. Sudama
C. Uddhava
D. Vidura
✓ Correct Answer: A. Akrura

33. What did Krishna break at Kamsa's arena before confronting him?
A. A throne
B. A bow
C. A chariot
D. A temple
✓ Correct Answer: B. A bow

34. Which wrestlers did Krishna and Balarama defeat in Mathura?
A. Chanura and Mushtika
B. Bhima and Duryodhana
C. Karna and Arjuna
D. Drona and Kripa
✓ Correct Answer: A. Chanura and Mushtika

35. Who killed the tyrant Kamsa?
A. Balarama
B. Krishna
C. Vasudeva
D. Ugrasena
✓ Correct Answer: B. Krishna

36. Who was restored as king of Mathura after Kamsa's death?
A. Ugrasena
B. Jarasandha
C. Nanda
D. Vasudeva
✓ Correct Answer: A. Ugrasena

37. Who was Kamsa's father?
A. Ugrasena
B. Vasudeva
C. Nanda
D. Dhritarashtra
✓ Correct Answer: A. Ugrasena

38. Which devotee and relative was known as Krishna's messenger and close companion?
A. Uddhava
B. Duryodhana
C. Karna
D. Drona
✓ Correct Answer: A. Uddhava

39. Which sage was the spiritual teacher of Krishna and Balarama?
A. Sandipani Muni
B. Vyasa
C. Narada
D. Vashishtha
✓ Correct Answer: A. Sandipani Muni

40. Where did Krishna and Balarama receive formal education?
A. Sandipani Muni's ashram
B. Hastinapura palace
C. Dwarka fort
D. Naimisharanya
✓ Correct Answer: A. Sandipani Muni's ashram

41. What did Krishna bring back as guru-dakshina for Sandipani Muni?
A. His lost son
B. A golden palace
C. A kingdom
D. A sacred book
✓ Correct Answer: A. His lost son

42. Which city became Krishna's kingdom after leaving Mathura?
A. Dwarka
B. Ayodhya
C. Kashi
D. Ujjain
✓ Correct Answer: A. Dwarka

43. Who was Krishna's principal queen from Vidarbha?
A. Rukmini
B. Draupadi
C. Kunti
D. Satyavati
✓ Correct Answer: A. Rukmini

44. Which queen was famous for her courage and devotion and was Krishna's wife?
A. Satyabhama
B. Gandhari
C. Subhadra
D. Uttara
✓ Correct Answer: A. Satyabhama

45. Who was Krishna's sister married to Arjuna?
A. Subhadra
B. Rukmini
C. Draupadi
D. Devaki
✓ Correct Answer: A. Subhadra

46. Who was the son of Krishna and Rukmini?
A. Pradyumna
B. Abhimanyu
C. Parikshit
D. Ghatotkacha
✓ Correct Answer: A. Pradyumna

47. Who kidnapped Rukmini before her planned marriage?
A. No one; Krishna rescued her
B. Kamsa
C. Drona
D. Bhishma
✓ Correct Answer: A. No one; Krishna rescued her

48. Whom did Rukmini want to marry?
A. Krishna
B. Shishupala
C. Jarasandha
D. Duryodhana
✓ Correct Answer: A. Krishna

49. Who was Rukmini's brother who opposed her marriage to Krishna?
A. Rukmi
B. Uddhava
C. Akrura
D. Sanjaya
✓ Correct Answer: A. Rukmi

50. Which devotee was famous for his intense friendship with Krishna and lived in poverty?
A. Sudama
B. Narada
C. Bhishma
D. Drona
✓ Correct Answer: A. Sudama

51. What humble gift did Sudama bring Krishna?
A. Chipped rice
B. Gold
C. Silk
D. A crown
✓ Correct Answer: A. Chipped rice

52. Which musical instrument is strongly associated with Krishna?
A. Flute
B. Veena
C. Drum
D. Conch only
✓ Correct Answer: A. Flute

53. What is another famous name of Krishna meaning 'one who gives pleasure to the cows and senses'?
A. Govinda
B. Mahadeva
C. Brahma
D. Agni
✓ Correct Answer: A. Govinda

54. What name of Krishna means 'protector of cows'?
A. Gopala
B. Varuna
C. Indra
D. Yama
✓ Correct Answer: A. Gopala

55. Which pastime describes Krishna dancing with the gopis?
A. Rasa Lila
B. Rajasuya
C. Ashvamedha
D. Swayamvara
✓ Correct Answer: A. Rasa Lila

56. Which season is especially associated with Krishna's rasa pastimes?
A. Spring
B. Monsoon only
C. Winter only
D. Autumn
✓ Correct Answer: D. Autumn

57. What was the name of Krishna's beloved cowherd village?
A. Vrindavan
B. Ayodhya
C. Kanchi
D. Mithila
✓ Correct Answer: A. Vrindavan

58. Who was Krishna's maternal uncle?
A. Kamsa
B. Ugrasena
C. Jarasandha
D. Nanda
✓ Correct Answer: A. Kamsa

59. Which demon attacked Krishna in the form of a cart?
A. Shakatasura
B. Aghasura
C. Kesi
D. Kaliya
✓ Correct Answer: A. Shakatasura

60. Which demon did Krishna kill after being tied to a mortar?
A. Yamal-Arjuna trees were liberated
B. Kamsa
C. Jarasandha
D. Shishupala
✓ Correct Answer: A. Yamal-Arjuna trees were liberated

61. Who tied Krishna to a mortar?
A. Mother Yashoda
B. Devaki
C. Rukmini
D. Rohini
✓ Correct Answer: A. Mother Yashoda

62. What name is given to the pastime of Krishna being bound by Yashoda?
A. Damodara Lila
B. Rasa Lila
C. Govardhana Lila
D. Kurukshetra Lila
✓ Correct Answer: A. Damodara Lila

63. What does the name Damodara refer to?
A. Bound around the waist
B. Born in Mathura
C. Holder of a flute
D. King of Dwarka
✓ Correct Answer: A. Bound around the waist

64. Who were liberated when Krishna pulled down the twin trees?
A. Nalakuvara and Manigriva
B. Jaya and Vijaya
C. Karna and Arjuna
D. Chanura and Mushtika
✓ Correct Answer: A. Nalakuvara and Manigriva

65. Who had cursed Nalakuvara and Manigriva to become trees?
A. Narada Muni
B. Vyasa
C. Drona
D. Durvasa
✓ Correct Answer: A. Narada Muni

66. Which sacred text contains the Bhagavad Gita?
A. Mahabharata
B. Ramayana
C. Rigveda
D. Arthashastra
✓ Correct Answer: A. Mahabharata

67. Who spoke the Bhagavad Gita?
A. Lord Krishna
B. Arjuna
C. Vyasa
D. Sanjaya
✓ Correct Answer: A. Lord Krishna

68. To whom did Krishna speak the Bhagavad Gita?
A. Arjuna
B. Bhima
C. Yudhishthira
D. Duryodhana
✓ Correct Answer: A. Arjuna

69. Where was the Bhagavad Gita spoken?
A. Kurukshetra
B. Mathura
C. Dwarka
D. Vrindavan
✓ Correct Answer: A. Kurukshetra

70. Who was Krishna's charioteer devotee in the Gita dialogue?
A. Arjuna was Krishna's charioteer?
B. Krishna was Arjuna's charioteer
C. Bhima was Arjuna's charioteer
D. Sanjaya was Krishna's charioteer
✓ Correct Answer: B. Krishna was Arjuna's charioteer

71. How many chapters are in the Bhagavad Gita?
A. 18
B. 12
C. 24
D. 108
✓ Correct Answer: A. 18

72. What is the central battlefield context of the Bhagavad Gita?
A. Kurukshetra war
B. Lanka war
C. Mathura uprising
D. Dwarka festival
✓ Correct Answer: A. Kurukshetra war

73. Which Pandava was Krishna's close friend and disciple in the Gita?
A. Arjuna
B. Nakula
C. Sahadeva
D. Bhima
✓ Correct Answer: A. Arjuna

74. What does Bhagavad Gita literally mean?
A. Song of God
B. Book of Kings
C. Science of War
D. Prayer of Fire
✓ Correct Answer: A. Song of God

75. Which yoga is emphasized as selfless action without attachment to results?
A. Karma Yoga
B. Hatha Yoga
C. Laya Yoga
D. Mantra Yoga
✓ Correct Answer: A. Karma Yoga

76. Which yoga focuses on loving devotion to God?
A. Bhakti Yoga
B. Karma Yoga
C. Hatha Yoga
D. Raja Yoga
✓ Correct Answer: A. Bhakti Yoga

77. Which yoga focuses on knowledge and understanding of the self?
A. Jnana Yoga
B. Bhakti Yoga
C. Karma Yoga
D. Kriya Yoga
✓ Correct Answer: A. Jnana Yoga

78. According to the Gita, the soul is?
A. Eternal
B. Destroyed with the body
C. Made of earth only
D. Temporary like clothes
✓ Correct Answer: A. Eternal

79. According to the Gita, what happens to the body?
A. It is temporary
B. It is eternal
C. It never changes
D. It is the soul
✓ Correct Answer: A. It is temporary

80. Which analogy does the Gita use for the soul changing bodies?
A. Changing worn-out garments
B. Changing kingdoms
C. Changing weapons
D. Changing teachers
✓ Correct Answer: A. Changing worn-out garments

81. What should a person focus on according to Karma Yoga?
A. Duty without attachment to results
B. Only results
C. Avoiding all action
D. Seeking fame
✓ Correct Answer: A. Duty without attachment to results

82. Which chapter contains the famous teaching about Krishna's universal form?
A. Chapter 11
B. Chapter 1
C. Chapter 5
D. Chapter 18
✓ Correct Answer: A. Chapter 11

83. What is the Sanskrit name for Krishna's universal form?
A. Vishvarupa
B. Rasika
C. Yajna
D. Dharma
✓ Correct Answer: A. Vishvarupa

84. Who was granted divine vision to see the universal form?
A. Arjuna
B. Duryodhana
C. Karna
D. Drona
✓ Correct Answer: A. Arjuna

85. Which chapter of the Gita is called Bhakti Yoga?
A. Chapter 12
B. Chapter 2
C. Chapter 6
D. Chapter 16
✓ Correct Answer: A. Chapter 12

86. Which chapter is known for describing the field and the knower of the field?
A. Chapter 13
B. Chapter 3
C. Chapter 7
D. Chapter 10
✓ Correct Answer: A. Chapter 13

87. Which chapter discusses the three modes of material nature?
A. Chapter 14
B. Chapter 4
C. Chapter 8
D. Chapter 17
✓ Correct Answer: A. Chapter 14

88. What are the three gunas?
A. Sattva, Rajas, Tamas
B. Dharma, Artha, Kama
C. Brahma, Vishnu, Shiva
D. Earth, Water, Fire
✓ Correct Answer: A. Sattva, Rajas, Tamas

89. Which guna is associated with goodness and clarity?
A. Sattva
B. Rajas
C. Tamas
D. Maya
✓ Correct Answer: A. Sattva

90. Which guna is associated with passion and activity?
A. Rajas
B. Sattva
C. Tamas
D. Shanti
✓ Correct Answer: A. Rajas

91. Which guna is associated with inertia and ignorance?
A. Tamas
B. Sattva
C. Rajas
D. Bhakti
✓ Correct Answer: A. Tamas

92. What does Krishna ask Arjuna to surrender unto in the concluding teaching?
A. Krishna alone
B. Material wealth
C. The battlefield
D. The senses
✓ Correct Answer: A. Krishna alone

93. Who narrated the events of the Kurukshetra war to Dhritarashtra?
A. Sanjaya
B. Arjuna
C. Bhishma
D. Vidura
✓ Correct Answer: A. Sanjaya

94. Who granted Sanjaya divine vision?
A. Vyasa
B. Krishna
C. Narada
D. Drona
✓ Correct Answer: A. Vyasa

95. What was Arjuna's first major emotional reaction on seeing relatives in battle?
A. Compassion and grief
B. Joy
C. Anger at Krishna
D. Sleep
✓ Correct Answer: A. Compassion and grief

96. What is dharma generally understood as?
A. Righteous duty
B. Only ritual
C. Wealth
D. Physical strength
✓ Correct Answer: A. Righteous duty

97. According to Krishna, what is one of the greatest obstacles to spiritual realization?
A. Uncontrolled desires and attachment
B. Eating fruit
C. Learning
D. Service
✓ Correct Answer: A. Uncontrolled desires and attachment

98. Which sense-related discipline is encouraged in the Gita?
A. Control of mind and senses
B. Unlimited indulgence
C. Avoiding all learning
D. Constant anger
✓ Correct Answer: A. Control of mind and senses

99. What does Krishna describe as the true self?
A. Atman
B. Body
C. Mind alone
D. Social status
✓ Correct Answer: A. Atman

100. Which chapter begins with Arjuna's despondency?
A. Chapter 1
B. Chapter 18
C. Chapter 11
D. Chapter 7
✓ Correct Answer: A. Chapter 1
"""

with open("scripts/raw_part1.txt", "w") as f:
    f.write(raw_data.strip())

print("Saved part 1 (1-100)")
