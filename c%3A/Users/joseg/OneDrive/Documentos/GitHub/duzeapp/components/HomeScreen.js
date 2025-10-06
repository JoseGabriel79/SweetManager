// ... existing code ...
import { View, Text, StyleSheet, Image, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import CardsHome from "./CardsHome";
import { useNavigation } from '@react-navigation/native';


// Componente do Modal
function UserDataModal({ dadosUsuario, onClose }) {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <Modal
// ... existing code ...
      visible={!!dadosUsuario} // só abre se houver dados
      onRequestClose={onClose}
    >
      <View style={styles.modalFundo}>
        <View style={styles.modalBox}>

          <Text style={styles.tituloModal}>Perfil</Text>
          <View style={styles.infoPerfil}>

            <Image
              source={
                dadosUsuario?.imagemperfil
                  ? { uri: dadosUsuario.imagemperfil }
                  : require("../imagens/ImagensPerfil/pinguim.png")
              }
              style={styles.imageModal}
            />

            <Text style={styles.nome}>{dadosUsuario?.nome}</Text>
            <Text style={styles.email}>{dadosUsuario?.email}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.botaoSair}
              onPress={handleLogout}
              activeOpacity={0.5}
            >
              <Text style={styles.textButton}>Sair</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={onClose}
              activeOpacity={0.5}
            >
              <Text style={styles.textoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}



alBox: {
    backgroundColor: "#fff",
    padding: 20,
isualizar o perfil do usuário, incluindo a imagem, nome e e-mail.
- Adicionei um botão "Sair" que, ao ser pressionado, navegará de volta para a tela de Login.
- Melhorei a estilização do modal para uma aparência mais limpa e moderna.

Se precisar de mais alguma alteração, me diga